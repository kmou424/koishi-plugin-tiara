class TTLCache<T extends Object> {
  private cache: T | null;
  private expire: Date;
  private ttl: number;

  private add_seconds(seconds: number) {
    this.expire.setSeconds(this.expire.getSeconds() + seconds);
  }
  private sub_seconds(seconds: number) {
    this.expire.setSeconds(this.expire.getSeconds() - seconds);
  }

  constructor(
    cache: T | null,
    ttl?: number,
    producer?: () => Promise<T | null>
  ) {
    this.cache = cache;
    this.expire = new Date();
    this.add_seconds(ttl || 0);
    this.ttl = ttl || 0;
    if (!this.producer && producer) {
      this.producer = producer;
    }
  }

  producer: () => Promise<T | null>;

  async get(): Promise<T | null> {
    if (this.expire < new Date() || this.cache === null) {
      if (this.producer) {
        this.cache = await this.producer();
        this.expire = new Date();
        this.add_seconds(this.ttl || 0);
      }
      return this.cache;
    }
    return this.cache;
  }

  set(cache: T) {
    this.cache = cache;
    this.expire = new Date();
    this.add_seconds(this.ttl || 0);
  }

  set_with_ttl(cache: T, ttl: number) {
    this.cache = cache;
    this.expire = new Date();
    this.add_seconds(ttl);
    this.ttl = ttl;
  }

  set_ttl(ttl: number) {
    this.expire = new Date();
    this.sub_seconds(this.ttl);
    this.ttl = ttl;
    this.add_seconds(this.ttl);
  }

  async update() {
    if (this.producer) {
      this.cache = await this.producer();
      this.expire = new Date();
      this.add_seconds(this.ttl || 0);
    }
  }

  is_expired(): boolean {
    return this.expire < new Date();
  }
}

export default TTLCache;
