import { Tables } from "koishi";
import { PluginContext } from "../type";
import { Repository } from "./repository";
import { IORM, IRepository, ORMConfig, RepositoryConfig } from "./type";

/**
 * ORM 工厂类
 * 负责创建和管理所有 Repository
 */
export class ORM implements IORM {
  private repositories: Map<string, IRepository<any>> = new Map();
  private config: Required<ORMConfig>;
  private ctx: PluginContext;

  constructor(ctx: PluginContext, config: ORMConfig = {}) {
    this.ctx = ctx;
    this.config = {
      writebackInterval: config.writebackInterval ?? 5000,
      autoInitialize: config.autoInitialize ?? false,
      maxBatchSize: config.maxBatchSize ?? 100,
      verbose: config.verbose ?? false,
    };

    this.ctx.logger.info("[ORM] initialized");
  }
  disposeRepository<K extends keyof Tables>(tableName: K): Promise<void> {
    throw new Error("method not implemented");
  }

  /**
   * 创建 Repository
   */
  createRepository<K extends keyof Tables>(
    config: RepositoryConfig<K>
  ): IRepository<Tables[K]> {
    const { tableName } = config;

    // 创建 Repository
    const repository = new Repository<K>(
      this.ctx,
      config,
      this.config.writebackInterval,
      this.config.maxBatchSize,
      this.config.verbose
    );

    // 自动初始化
    if (this.config.autoInitialize) {
      repository.initialize().catch((error) => {
        this.error(
          tableName as string,
          "failed to auto-initialize repository",
          error
        );
      });
    }

    // 存储 Repository
    this.repositories.set(tableName as string, repository);

    this.log(tableName as string, `repository created`);
    return repository;
  }

  /**
   * 获取已创建的 Repository
   */
  getRepository<K extends keyof Tables>(
    tableName: K
  ): IRepository<Tables[K]> | undefined {
    return this.repositories.get(tableName as string);
  }

  /**
   * 销毁所有 Repository
   */
  async dispose(): Promise<void> {
    const disposePromises: Promise<void>[] = [];

    for (const repository of this.repositories.values()) {
      disposePromises.push(repository.dispose());
    }

    await Promise.all(disposePromises);
    this.repositories.clear();
  }

  /**
   * 获取所有 Repository 的统计信息
   */
  getAllStats(): Record<
    string,
    { cacheSize: number; dirtyCount: number; deleteCount: number }
  > {
    const stats: Record<
      string,
      { cacheSize: number; dirtyCount: number; deleteCount: number }
    > = {};

    for (const [tableName, repository] of this.repositories.entries()) {
      stats[tableName] = repository.stats();
    }

    return stats;
  }

  /**
   * 立即执行所有 Repository 的 flush
   */
  async flushAll(): Promise<void> {
    const flushPromises: Promise<void>[] = [];

    for (const repository of this.repositories.values()) {
      flushPromises.push(repository.flush());
    }

    await Promise.all(flushPromises);
  }

  /**
   * 日志
   */
  private log(tableName: string, message: string): void {
    this.ctx.logger.info(`[ORM:${tableName}] ${message}`);
  }

  private error(tableName: string, message: string, error: Error): void {
    this.ctx.logger.error(`[ORM:${tableName}] ${message}:`, error);
  }
}
