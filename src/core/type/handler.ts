import { Context } from "koishi";
import { Message } from "../protocol";
import { Template } from "../template";

export interface HandlerHub {
  (ctx: Context): void;
}

export interface MessageHandler {
  (msg: Message): Promise<void>;
  template: Template;
}
