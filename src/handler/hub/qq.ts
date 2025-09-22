import { Context } from "koishi";
import { Config } from "../../config";
import { HandlerHub, MsgPlatform, PluginContext } from "../../core/type";
import IsTruthHandlerProvider from "../providers/command/istruth";
import MiniAppMessageHandlerProvider from "../providers/message/miniapp";

export class QQHandlerHub extends HandlerHub {
  Context = (ctx: Context, config: Config) => {
    ctx = ctx.platform(...MsgPlatform.asKoishi(MsgPlatform.QQ));
    return PluginContext(ctx, config);
  };

  Providers = () => [
    new MiniAppMessageHandlerProvider(),
    new IsTruthHandlerProvider(),
  ];
}
