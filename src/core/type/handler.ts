import { Message } from "@tiara/core/protocol";
import { Template } from "@tiara/core/template";
import { PluginContext } from "./context";

export type HandlerHub = (ctx: PluginContext) => void;

export interface MessageHandlerFunc {
  (msg: Message): Promise<void>;
  template: Template;
}
