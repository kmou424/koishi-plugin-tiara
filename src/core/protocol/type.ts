enum MsgType {
  Json = "json",
  Text = "text",
  Image = "image",
  Face = "face",
  Unknown = "unknown",
}

enum MsgChannel {
  QQ = "qq",
  Telegram = "telegram",
  Unknown = "unknown",
}

interface MsgContent {
  type: MsgType;
  data: Object;
}

export { MsgChannel, MsgContent, MsgType };
