import { MessageHandler } from "./type";

import { QQJSONMessageHandler } from "./channel/qq";

const MessageRegistry: Array<MessageHandler> = [new QQJSONMessageHandler()];

export { MessageRegistry };
