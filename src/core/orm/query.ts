import { Query, QueryOptions } from "./type";

/**
 * 查询匹配工具类
 */
export class QueryMatcher {
  /**
   * 检查单条记录是否匹配查询条件
   */
  static matches<T extends Record<string, any>>(
    record: T,
    query?: Query<T>
  ): boolean {
    if (!query || Object.keys(query).length === 0) {
      return true;
    }

    for (const key in query) {
      const queryValue = query[key];
      const recordValue = record[key];

      // 支持数组形式的 IN 查询
      if (Array.isArray(queryValue)) {
        if (!queryValue.includes(recordValue)) {
          return false;
        }
      } else {
        // 精确匹配
        if (recordValue !== queryValue) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * 从缓存中查询匹配的记录
   */
  static query<T extends Record<string, any>>(
    cache: Map<string, T>,
    query?: Query<T>,
    options?: QueryOptions
  ): T[] {
    let results: T[] = [];

    // 遍历缓存查找匹配项
    for (const record of cache.values()) {
      if (this.matches(record, query)) {
        results.push(record);
      }
    }

    // 排序
    if (options?.sort) {
      results = this.sort(results, options.sort);
    }

    // 分页
    if (options?.offset !== undefined || options?.limit !== undefined) {
      const offset = options.offset || 0;
      const limit = options.limit;
      results = results.slice(offset, limit ? offset + limit : undefined);
    }

    return results;
  }

  /**
   * 排序结果
   */
  private static sort<T extends Record<string, any>>(
    records: T[],
    sort: Record<string, "asc" | "desc">
  ): T[] {
    const sortKeys = Object.keys(sort);
    if (sortKeys.length === 0) {
      return records;
    }

    return records.sort((a, b) => {
      for (const key of sortKeys) {
        const direction = sort[key] === "asc" ? 1 : -1;
        const aValue = a[key];
        const bValue = b[key];

        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
      }
      return 0;
    });
  }

  /**
   * 生成主键字符串
   */
  static generatePrimaryKey<T extends Record<string, any>>(
    record: T,
    primaryKeys: Array<keyof T>
  ): string {
    return primaryKeys.map((key) => String(record[key])).join(":");
  }

  /**
   * 深度克隆对象（避免缓存污染）
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 合并对象（upsert 用）
   */
  static merge<T extends Record<string, any>>(
    target: T,
    source: Partial<T>
  ): T {
    return { ...target, ...source };
  }
}
