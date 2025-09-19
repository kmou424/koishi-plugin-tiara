import { Message } from "@tiara/core/protocol";
import { Template } from "@tiara/core/template";
import { Command, Session } from "koishi";
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
