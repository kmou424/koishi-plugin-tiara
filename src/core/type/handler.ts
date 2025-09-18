import { Context } from "koishi";
import { Message } from "../protocol";
import { Template } from "../template";

export type HandlerHub = (ctx: Context) => void;

export interface MessageHandlerFunc {
  (msg: Message): Promise<void>;
  template: Template;
}
