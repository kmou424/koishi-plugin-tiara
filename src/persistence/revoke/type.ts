import { Element } from "koishi";

export type CacheMessage = {
  message: Element[];
  time: number;
};

export function createCacheMessage(
  message: Element[],
  time: number
): CacheMessage {
  return {
    message,
    time,
  };
}

export type CacheKey = {
  platform: string;
  selfId: string;
  channelId: string;
  messageId: string;

  toString(): string;
  fromString(string: string): CacheKey;
};

export function createCacheKey(
  platform: string,
  selfId: string,
  channelId: string,
  messageId: string
): CacheKey {
  return {
    platform,
    selfId,
    channelId,
    messageId,

    toString: () => {
      return `${platform}:${selfId}:${channelId}:${messageId}`;
    },
    fromString: (string: string) => {
      const [platform, selfId, channelId, messageId] = string.split(":");
      return createCacheKey(platform, selfId, channelId, messageId);
    },
  };
}
