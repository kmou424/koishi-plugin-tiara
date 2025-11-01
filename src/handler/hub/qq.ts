import { Config } from "../../config";
import { HandlerHub, MsgPlatform, PluginContext } from "../../core/type";
import IsTruthHandlerProvider from "../providers/command/istruth";
import MiniAppMessageHandlerProvider from "../providers/message/miniapp";

export class QQHandlerHub extends HandlerHub {
  Deploy(ctx: PluginContext, config: Config) {
    ctx.override(ctx().platform(...MsgPlatform.asKoishi(MsgPlatform.QQ)));
    this.Providers().forEach((p) => p.Provide(ctx));
  }

  Providers = () => [
    new MiniAppMessageHandlerProvider(),
    new IsTruthHandlerProvider(),
  ];
}
