import { Context } from "koishi";
import { Config } from "../../config";
import { createPluginContext } from "../../core/context";
import { HandlerHub } from "../../core/type";
import TiaraHandlerProvider from "../providers/command/tiara";
import RevokeHandlerProvider from "../providers/message/revoke";

export class PluginHandlerHub extends HandlerHub {
  Deploy(ctx: Context, config: Config) {
    this.Providers().forEach((p) =>
      p.Provide(createPluginContext(ctx, config))
    );
  }

  Providers = () => [new TiaraHandlerProvider(), new RevokeHandlerProvider()];
}
