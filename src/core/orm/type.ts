import { Model, Tables } from "koishi";

/**
 * 表操作类型枚举
 */
export enum OperationType {
  Create = "create",
  Update = "update",
  Delete = "delete",
}

/**
 * 待写回操作
 */
export interface PendingOperation<T = any> {
  type: OperationType;
  data: T;
  timestamp: number;
}

/**
 * 查询条件类型（简化版 Koishi Query）
 */
export type Query<T> = {
  [K in keyof T]?: T[K] | T[K][];
};

/**
 * 查询选项
 */
export interface QueryOptions {
  limit?: number;
  offset?: number;
  sort?: Record<string, "asc" | "desc">;
}

/**
 * Repository 接口（仓库模式）
 */
export interface IRepository<T extends Record<string, any>> {
  /**
   * 获取表名
   */
  readonly tableName: string;

  /**
   * 初始化 - 从数据库加载所有数据
   */
  initialize(): Promise<void>;

  /**
   * 同步查询数据（从缓存）
   */
  get(query?: Query<T>, options?: QueryOptions): T[];

  /**
   * 同步创建数据
   */
  create(data: Partial<T> | Partial<T>[]): T[];

  /**
   * 同步更新或插入数据
   */
  upsert(data: Partial<T> | Partial<T>[]): T[];

  /**
   * 同步删除数据
   */
  remove(query: Query<T>): number;

  /**
   * 立即执行 writeback
   */
  flush(): Promise<void>;

  /**
   * 停止仓库（停止定时器，执行最后的 flush）
   */
  dispose(): Promise<void>;

  /**
   * 获取缓存统计信息
   */
  stats(): {
    cacheSize: number;
    dirtyCount: number;
    deleteCount: number;
  };
}

/**
 * ORM 配置
 */
export interface ORMConfig {
  /**
   * Writeback 间隔（毫秒），默认 5000ms
   */
  writebackInterval?: number;

  /**
   * 是否在启动时自动初始化，默认 true
   */
  autoInitialize?: boolean;

  /**
   * 最大批量写入数量，默认 100
   */
  maxBatchSize?: number;

  /**
   * 是否启用详细日志，默认 false
   */
  verbose?: boolean;
}

/**
 * Repository 配置（简化版，直接从 Model.Config 推断）
 */
export interface RepositoryConfig<K extends keyof Tables> {
  /**
   * 表名
   */
  tableName: K;

  /**
   * Model 配置（从 Koishi Schema 获取）
   */
  modelConfig: Model.Config;
}

/**
 * ORM 工厂接口
 */
export interface IORM {
  /**
   * 创建 Repository
   */
  createRepository<K extends keyof Tables>(
    config: RepositoryConfig<K>
  ): IRepository<Tables[K]>;

  /**
   * 获取已创建的 Repository
   */
  getRepository<K extends keyof Tables>(
    tableName: K
  ): IRepository<Tables[K]> | undefined;

  /**
   * 销毁所有 Repository
   */
  dispose(): Promise<void>;
}
