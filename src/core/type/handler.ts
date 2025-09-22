import { Command, Context, Session } from "koishi";
import { Config } from "../../config";
import { Message } from "../protocol";
import { Template } from "../template";
import { PluginContext } from "./context";

export abstract class HandlerHub {
  constructor(private ctx: Context, private config: Config) {
    const context = this.Context(ctx, config);
    this.Providers().forEach((p) => p.Provide(context));
  }

  abstract Context(ctx: Context, config: Config): PluginContext;

  abstract Providers(): HandlerProvider[];
}

export abstract class HandlerProvider {
  abstract Provide(ctx: PluginContext): void;
}

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
