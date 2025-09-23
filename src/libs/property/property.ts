import Global from "../../core/global";
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

  constructor(key: string, def: T) {
    this.key = key;
    this.def = def;
  }

  default(def: T): this {
    this.def = def;
    return this;
  }

  async get(): Promise<T> {
    const value = await getProperty(this.key);
    if (value) {
      return parseFunc[typeof this.def](value);
    }
    return this.def;
  }

  async set(value: T | string): Promise<boolean> {
    if (typeof value === "string") {
      return await setProperty(this.key, value);
    }
    return await setProperty(this.key, stringifyFunc[typeof this.def](value));
  }
}

export class Property {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  boolean(): TypedProperty<boolean> {
    return new TypedProperty<boolean>(this.key, false);
  }

  string(): TypedProperty<string> {
    return new TypedProperty<string>(this.key, "");
  }

  number(): TypedProperty<number> {
    return new TypedProperty<number>(this.key, 0);
  }

  object(): TypedProperty<object> {
    return new TypedProperty<object>(this.key, {});
  }
}
