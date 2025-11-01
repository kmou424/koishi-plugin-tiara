import { Command, Session } from "koishi";
import { Config } from "../../config";
import { PluginContext } from "./context";

export abstract class HandlerHub {
  abstract Deploy(ctx: PluginContext, config: Config): void;

  abstract Providers(): HandlerProvider[];
}

export abstract class HandlerProvider {
  abstract Provide(ctx: PluginContext): void;
}

export type MessageListener = (session: Session) => Promise<void>;

export type MessageHandlerFunc = (ctx: PluginContext) => MessageListener;

export interface CommandHandlerInput {
  args: [string, ...string[]];
  next: () => Promise<void>;
  options: Record<string, unknown>;
  session: Session;
}

export type CommandHandlerFunc = (ctx: PluginContext) => Command.Action;
