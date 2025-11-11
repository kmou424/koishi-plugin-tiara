export type Result<T> = {
  err: Error | null;

  unwrap: () => T;
  unwrapOr: (defaultValue: T) => T;

  isOk: () => boolean;
  isErr: () => boolean;
} & Omit<Record<string, T | null>, "err">;

const dataKey = "data";

export const Result = <T>(data: T | null, err: Error | null): Result<T> => {
  const base: {
    data: T | null;
    err: Error | null;
  } = {
    data,
    err,
  };

  const proxy = new Proxy(base, {
    get(target, prop: string | symbol) {
      if (prop === "err") {
        return target.err;
      }
      if (typeof prop === "string") {
        return target.data;
      }
      return (target as any)[prop];
    },
    has(target, prop: string | symbol) {
      if (prop === "err") {
        return true;
      }
      if (typeof prop === "string") {
        return true;
      }
      return prop in target;
    },
    ownKeys(target) {
      return [dataKey, "err"];
    },
    getOwnPropertyDescriptor(target, prop: string | symbol) {
      if (prop === "err") {
        return {
          enumerable: true,
          configurable: true,
          value: target.err,
        };
      }
      if (typeof prop === "string") {
        return {
          enumerable: true,
          configurable: true,
          value: target.data,
        };
      }
      return undefined;
    },
  }) as unknown as Result<T>;

  proxy.unwrap = () => {
    if (proxy.err) {
      throw proxy.err;
    }
    return proxy.data!;
  };
  proxy.unwrapOr = (defaultValue: T) => {
    if (proxy.err) {
      return defaultValue;
    }
    return proxy.data!;
  };
  proxy.isOk = () => {
    return proxy.err === null;
  };
  proxy.isErr = () => {
    return proxy.err !== null;
  };

  return proxy;
};
