import { Mutex } from "async-mutex";
import Global from "../../../core/global";
import { TableName } from "./schema";
import { PropertyValue } from "./type";

const cache: Record<string, string> = {};

async function getProperty(key: string): Promise<string | null> {
  if (cache[key]) {
    return cache[key];
  }
  const records = await Global.Context().model.get(TableName, key);
  if (records && records.length > 0) {
    return records[0].value;
  }
  return null;
}

async function setProperty(key: string, value: string): Promise<boolean> {
  const result = await Global.Context().model.upsert(TableName, [
    { key, value },
  ]);
  if (result.modified + result.inserted == 1) {
    cache[key] = value;
    return true;
  }
  return false;
}

export async function initPropertyMap(
  map: Record<string, TypedProperty<PropertyValue>>
) {
  for (const key in map) {
    const property = map[key];
    await property.getAsync();
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
  private lock: Mutex;

  constructor(key: string, def: T) {
    this.key = key;
    this.def = def;
    this.cache = def;
  }

  mutex(): Mutex {
    return this.lock ?? (this.lock = new Mutex());
  }

  get(): T {
    this.getAsync().then((value) => {
      this.cache = value;
    });
    return this.cache;
  }

  async getAsync(): Promise<T> {
    const value = await getProperty(this.key);
    if (value) {
      this.cache = parseFunc[typeof this.def](value);
      return this.cache;
    }
    return this.cache;
  }

  set(value: T | string): Promise<void> {
    if (typeof value === "string") {
      this.cache = parseFunc[typeof this.def](value);
    } else {
      this.cache = value;
    }
    return this.setAsync(value);
  }

  async setAsync(value: T | string) {
    if (typeof value === "string") {
      this.cache = parseFunc[typeof this.def](value);
      await setProperty(this.key, value);
      return;
    }
    this.cache = value;
    await setProperty(this.key, stringifyFunc[typeof this.def](value));
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
