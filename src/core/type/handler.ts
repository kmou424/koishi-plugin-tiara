import { Command, Context, Session } from "koishi";
import { Config } from "../../config";
import { Message } from "../protocol";
import { Template } from "../template";
import { PluginContext } from "./context";

export type HandlerHub = (ctx: Context, config: Config) => void;

export type HandlerProvider = (ctx: PluginContext) => void;

export interface MessageHandlerFunc {
  (msg: Message): Promise<void>;
  template: Template;
}

export interface CommandHandlerInput {
  args: [string, ...string[]];
  next: () => Promise<void>;
  options: Record<string, unknown>;
  session: Session;
}

export type CommandHandlerFunc = (ctx: PluginContext) => Command.Action;
