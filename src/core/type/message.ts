export enum MsgType {
  Json = "json",
  Text = "text",
  Image = "image",
  Face = "face",
  Unknown = "unknown",
}

export enum MsgPlatform {
  QQ = "qq",
  Telegram = "telegram",
  Unknown = "unknown",
}

export namespace MsgPlatform {
  export const as_koishi = (platform: MsgPlatform): Array<string> => {
    switch (platform) {
      case MsgPlatform.QQ:
        return ["onebot"];
      case MsgPlatform.Telegram:
        return ["telegram"];
      default:
        return [];
    }
  };
}

export interface MsgContent {
  type: MsgType;
  data: Object;
}
