import { Tables } from "koishi";
import { PluginContext } from "../type";
import { QueryMatcher } from "./query";
import {
  IRepository,
  OperationType,
  PendingOperation,
  Query,
  QueryOptions,
  RepositoryConfig,
} from "./type";

/**
 * Repository 实现（仓库模式）
 * 负责单张表的缓存管理和异步写回
 */
export class Repository<K extends keyof Tables>
  implements IRepository<Tables[K]>
{
  readonly tableName: K;
  private readonly ctx: PluginContext;
  private readonly primaryKeys: string[];
  private readonly autoIncrementKey?: string;
  private readonly writebackInterval: number;
  private readonly maxBatchSize: number;
  private readonly verbose: boolean;

  // 缓存: primaryKey -> record
  private cache: Map<string, Tables[K]> = new Map();

  // 脏数据队列: primaryKey -> 待写回操作
  private dirtyQueue: Map<string, PendingOperation<Tables[K]>> = new Map();

  // 删除队列: primaryKey -> 删除时间戳
  private deleteQueue: Map<string, number> = new Map();

  // 定时器（Koishi 的 setInterval 返回清理函数）
  private timer?: () => void;

  // 自增计数器
  private autoIncrementCounter: number = 0;

  // 初始化状态
  private initialized: boolean = false;

  constructor(
    ctx: PluginContext,
    config: RepositoryConfig<K>,
    writebackInterval: number = 5000,
    maxBatchSize: number = 100,
    verbose: boolean = false
  ) {
    this.ctx = ctx;
    this.tableName = config.tableName;
    this.writebackInterval = writebackInterval;
    this.maxBatchSize = maxBatchSize;
    this.verbose = verbose;

    // 从 Model.Config 提取主键和自增配置
    const modelConfig = config.modelConfig;
    this.primaryKeys = Array.isArray(modelConfig.primary)
      ? modelConfig.primary
      : [modelConfig.primary];
    this.autoIncrementKey = modelConfig.autoInc
      ? this.primaryKeys[0]
      : undefined;
  }

  /**
   * 初始化 - 从数据库加载所有数据
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.debug_log("initializing table repository...");

    try {
      // 从数据库加载所有数据
      const records = await this.ctx().model.get(this.tableName as any, {});

      this.debug_log(`loaded ${records.length} records from database`);

      // 填充缓存
      for (const record of records) {
        const key = this.getPrimaryKey(record as unknown as Tables[K]);
        this.cache.set(
          key,
          QueryMatcher.deepClone(record as unknown as Tables[K])
        );

        // 更新自增计数器
        if (this.autoIncrementKey) {
          const autoIncValue = record[this.autoIncrementKey as string];
          if (
            typeof autoIncValue === "number" &&
            autoIncValue > this.autoIncrementCounter
          ) {
            this.autoIncrementCounter = autoIncValue;
          }
        }
      }

      // 启动定时写回
      this.startWritebackTimer();

      this.initialized = true;
      this.debug_log("initialization complete");

      this.info_log(`initialized with ${this.cache.size} records`);
    } catch (error) {
      this.ctx.logger.error(
        `failed to initialize table repository for ${this.tableName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * 同步查询数据（从缓存）
   */
  get(query?: Query<Tables[K]>, options?: QueryOptions): Tables[K][] {
    this.ensureInitialized();
    const results = QueryMatcher.query(this.cache, query, options);
    // 返回克隆避免外部修改缓存
    return results.map((r) => QueryMatcher.deepClone(r));
  }

  /**
   * 同步创建数据
   */
  create(data: Partial<Tables[K]> | Partial<Tables[K]>[]): Tables[K][] {
    this.ensureInitialized();

    const items = Array.isArray(data) ? data : [data];
    const created: Tables[K][] = [];

    for (const item of items) {
      // 处理自增主键
      if (this.autoIncrementKey) {
        if (!item[this.autoIncrementKey]) {
          this.autoIncrementCounter++;
          (item as any)[this.autoIncrementKey] = this.autoIncrementCounter;
        }
      }

      const record = item as Tables[K];
      const key = this.getPrimaryKey(record);

      // 检查是否已存在
      if (this.cache.has(key)) {
        this.ctx.logger.warn(
          `record with primary key ${key} already exists in ${this.tableName}`
        );
        continue;
      }

      // 添加到缓存
      const cloned = QueryMatcher.deepClone(record);
      this.cache.set(key, cloned);

      // 标记为脏数据
      this.dirtyQueue.set(key, {
        type: OperationType.Create,
        data: cloned,
        timestamp: Date.now(),
      });

      created.push(QueryMatcher.deepClone(cloned));
    }

    this.debug_log(`created ${created.length} records`);
    return created;
  }

  /**
   * 同步更新或插入数据
   */
  upsert(data: Partial<Tables[K]> | Partial<Tables[K]>[]): Tables[K][] {
    this.ensureInitialized();

    const items = Array.isArray(data) ? data : [data];
    const upserted: Tables[K][] = [];

    for (const item of items) {
      const record = item as Tables[K];
      const key = this.getPrimaryKey(record);

      let result: Tables[K];
      if (this.cache.has(key)) {
        // 更新现有记录
        const existing = this.cache.get(key)!;
        result = QueryMatcher.merge(existing, item);
        this.cache.set(key, result);

        this.dirtyQueue.set(key, {
          type: OperationType.Update,
          data: result,
          timestamp: Date.now(),
        });
      } else {
        // 插入新记录
        // 处理自增主键
        if (this.autoIncrementKey) {
          if (!item[this.autoIncrementKey]) {
            this.autoIncrementCounter++;
            (item as any)[this.autoIncrementKey] = this.autoIncrementCounter;
          }
        }

        result = record;
        this.cache.set(key, QueryMatcher.deepClone(result));

        this.dirtyQueue.set(key, {
          type: OperationType.Create,
          data: result,
          timestamp: Date.now(),
        });
      }

      upserted.push(QueryMatcher.deepClone(result));
    }

    this.debug_log(`upserted ${upserted.length} records`);
    return upserted;
  }

  /**
   * 同步删除数据
   */
  remove(query: Query<Tables[K]>): number {
    this.ensureInitialized();

    const toRemove = QueryMatcher.query(this.cache, query);
    let count = 0;

    for (const record of toRemove) {
      const key = this.getPrimaryKey(record);

      // 从缓存删除
      this.cache.delete(key);

      // 从脏队列移除（如果存在）
      this.dirtyQueue.delete(key);

      // 添加到删除队列
      this.deleteQueue.set(key, Date.now());

      count++;
    }

    this.debug_log(`removed ${count} records`);
    return count;
  }

  /**
   * 立即执行 writeback
   */
  async flush(): Promise<void> {
    await this.writeback();
  }

  /**
   * 停止管理器
   */
  async dispose(): Promise<void> {
    this.debug_log("disposing table repository...");

    // 停止定时器
    if (this.timer) {
      this.timer();
      this.timer = undefined;
    }

    // 执行最后的 flush
    await this.flush();

    // 清空缓存
    this.cache.clear();
    this.dirtyQueue.clear();
    this.deleteQueue.clear();

    this.initialized = false;
    this.debug_log("disposed");
  }

  /**
   * 获取统计信息
   */
  stats() {
    return {
      cacheSize: this.cache.size,
      dirtyCount: this.dirtyQueue.size,
      deleteCount: this.deleteQueue.size,
    };
  }

  /**
   * 启动定时写回
   */
  private startWritebackTimer(): void {
    if (this.timer) {
      return;
    }

    this.timer = this.ctx().setInterval(async () => {
      await this.writeback();
    }, this.writebackInterval);

    this.debug_log(
      `writeback timer started with interval ${this.writebackInterval}ms`
    );
  }

  /**
   * 执行写回操作
   */
  private async writeback(): Promise<void> {
    if (this.dirtyQueue.size === 0 && this.deleteQueue.size === 0) {
      return;
    }

    this.debug_log(
      `starting writeback: ${this.dirtyQueue.size} dirty, ${this.deleteQueue.size} deleted`
    );

    try {
      // 处理删除操作
      await this.writebackDeletes();

      // 处理创建/更新操作
      await this.writebackUpserts();

      this.info_log("writeback completed successfully");
    } catch (error) {
      this.ctx.logger.error(`writeback failed for ${this.tableName}:`, error);
      // 不清空队列，下次继续尝试
    }
  }

  /**
   * 写回删除操作
   */
  private async writebackDeletes(): Promise<void> {
    if (this.deleteQueue.size === 0) {
      return;
    }

    const keys = Array.from(this.deleteQueue.keys());
    const batches = this.chunkArray(keys, this.maxBatchSize);

    for (const batch of batches) {
      // 构建删除查询
      const deleteRecords = batch.map((key) => this.parsePrimaryKey(key));

      for (const record of deleteRecords) {
        try {
          await this.ctx().model.remove(this.tableName as any, record);
        } catch (error) {
          this.ctx.logger.error(
            `failed to delete record in ${this.tableName}:`,
            error
          );
        }
      }

      // 从删除队列移除
      batch.forEach((key) => this.deleteQueue.delete(key));
    }

    this.debug_log(`deleted ${keys.length} records from database`);
  }

  /**
   * 写回创建/更新操作
   */
  private async writebackUpserts(): Promise<void> {
    if (this.dirtyQueue.size === 0) {
      return;
    }

    const operations = Array.from(this.dirtyQueue.values());
    const batches = this.chunkArray(operations, this.maxBatchSize);

    for (const batch of batches) {
      const dataToUpsert = batch.map((op) => op.data);

      try {
        await this.ctx().model.upsert(this.tableName as any, dataToUpsert);

        // 从脏队列移除
        batch.forEach((op) => {
          const key = this.getPrimaryKey(op.data);
          this.dirtyQueue.delete(key);
        });
      } catch (error) {
        this.ctx.logger.error(
          `failed to upsert records in ${this.tableName}:`,
          error
        );
      }
    }

    this.debug_log(`upserted ${operations.length} records to database`);
  }

  /**
   * 获取主键字符串
   */
  private getPrimaryKey(record: Tables[K]): string {
    return QueryMatcher.generatePrimaryKey(record, this.primaryKeys as any);
  }

  /**
   * 解析主键字符串为查询对象
   */
  private parsePrimaryKey(key: string): Partial<Tables[K]> {
    const values = key.split(":");
    const result: any = {};

    this.primaryKeys.forEach((field, index) => {
      result[field] = values[index];
    });

    return result;
  }

  /**
   * 确保已初始化
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error(
        `Table repository for ${this.tableName} is not initialized. Call initialize() first.`
      );
    }
  }

  /**
   * 数组分块
   */
  private chunkArray<U>(array: U[], size: number): U[][] {
    const chunks: U[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 日志
   */
  private debug_log(message: string): void {
    if (this.verbose) {
      this.ctx.logger.debug(`[ORM:${this.tableName}] ${message}`);
    }
  }

  private info_log(message: string): void {
    this.ctx.logger.info(`[ORM:${this.tableName}] ${message}`);
  }
}
