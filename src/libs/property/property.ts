import { GetPropertyRepository } from "../../repositories";
import { PropertyValue } from "./type";

function getProperty(key: string): string | null {
  const records = GetPropertyRepository().get({ key });
  if (records && records.length > 0) {
    return records[0].value;
  }
  return null;
}

function setProperty(key: string, value: string): boolean {
  const result = GetPropertyRepository().upsert({ key, value });
  return result.length > 0;
}

export function initPropertyMap(
  map: Record<string, TypedProperty<PropertyValue>>
) {
  // 加载所有属性到各自的缓存中
  for (const key in map) {
    const property = map[key];
    property.get(); // 触发加载
  }
}

const parseFunc: Record<
  "boolean" | "string" | "number" | "object",
  (value: string) => PropertyValue
> = {
  boolean: (value: string) => value === "true",
  string: (value: string) => value,
  number: (value: string) => Number(value),
  object: (value: string) => JSON.parse(value),
};

const stringifyFunc: Record<
  "boolean" | "string" | "number" | "object",
  (value: PropertyValue) => string
> = {
  boolean: (value: boolean) => value.toString(),
  string: (value: string) => value,
  number: (value: number) => value.toString(),
  object: (value: object) => JSON.stringify(value),
};

export class TypedProperty<T extends PropertyValue> {
  private key: string;
  private def: T;
  private cache: T;

  constructor(key: string, def: T) {
    this.key = key;
    this.def = def;
    this.cache = def;
  }

  get(): T {
    const value = getProperty(this.key);
    if (value) {
      this.cache = parseFunc[typeof this.def](value);
    }
    return this.cache;
  }

  async getAsync(): Promise<T> {
    // 保持向后兼容，但内部使用同步操作
    return this.get();
  }

  set(value: T | string): void {
    if (typeof value === "string") {
      this.cache = parseFunc[typeof this.def](value);
      setProperty(this.key, value);
    } else {
      this.cache = value;
      setProperty(this.key, stringifyFunc[typeof this.def](value));
    }
  }

  async setAsync(value: T | string): Promise<void> {
    // 保持向后兼容，但内部使用同步操作
    this.set(value);
  }
}

export class Property {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  boolean(def?: boolean): TypedProperty<boolean> {
    return new TypedProperty<boolean>(this.key, def ?? false);
  }

  string(def?: string): TypedProperty<string> {
    return new TypedProperty<string>(this.key, def ?? "");
  }

  number(def?: number): TypedProperty<number> {
    return new TypedProperty<number>(this.key, def ?? 0);
  }

  object(def?: object): TypedProperty<object> {
    return new TypedProperty<object>(this.key, def ?? {});
  }
}
