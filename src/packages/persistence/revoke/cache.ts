import TTLCache from "../../../core/cache/ttl_cache";
import { PluginContext } from "../../../core/type";
import { CacheKey, CacheMessage } from "./type";

export class RevocableMessageCache {
  private static cacheMap: Map<string, TTLCache<CacheMessage>> = new Map();

  private static scanDelete() {
    this.cacheMap.forEach((item: TTLCache<CacheMessage>, key: string) => {
      if (item.isExpired()) {
        this.cacheMap.delete(key);
      }
    });
  }

  static startScanner(ctx: PluginContext) {
    ctx().setInterval(() => {
      RevocableMessageCache.scanDelete();
    }, 1000 * 60);
  }

  static add(key: CacheKey, message: CacheMessage, ttl: number) {
    this.cacheMap.set(key.toString(), new TTLCache<CacheMessage>(message, ttl));
  }

  static async load(key: CacheKey): Promise<CacheMessage | null> {
    const cache = this.cacheMap.get(key.toString());
    if (!cache) {
      return null;
    }
    return await cache.get();
  }

  static async delete(key: CacheKey) {
    this.cacheMap.delete(key.toString());
  }
}
