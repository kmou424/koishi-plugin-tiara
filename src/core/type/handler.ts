import { Command, Session } from "koishi";
import { Message } from "../protocol";
import { Template } from "../template";
import { PluginContext } from "./context";

export type HandlerHub = (ctx: PluginContext) => void;

export interface MessageHandlerFunc {
  (msg: Message): Promise<void>;
  template: Template;
}

export interface CommandHandlerInput {
  args: [string, ...string[]];
  next: () => Promise<void>;
  options: Record<string, any>;
  session: Session;
}

export type CommandHandlerFunc = (ctx: PluginContext) => Command.Action;
