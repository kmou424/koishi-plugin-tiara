import { Config } from "../../config";
import { HandlerHub, PluginContext } from "../../core/type";

import TiaraHandlerProvider from "../providers/command/tiara";
import UserHandlerProvider from "../providers/command/user";
import RevokeHandlerProvider from "../providers/message/revoke";

export class PluginHandlerHub extends HandlerHub {
  Deploy(ctx: PluginContext, config: Config) {
    this.Providers().forEach((p) => p.Provide(ctx));
  }

  Providers = () => [
    new TiaraHandlerProvider(),
    new RevokeHandlerProvider(),
    new UserHandlerProvider(),
  ];
}
