import { Context } from "koishi";
import { Message } from "../core/protocol";

interface MessageHandler {
  readonly AccpetChannel: string;
  handle(msg: Message): void;
}

interface CallbackCreator<Callback> {
  (ctx: Context): Callback;
}

export { CallbackCreator, MessageHandler };
