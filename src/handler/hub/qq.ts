import { Context } from "koishi";
import { Config } from "../../config";
import { HandlerHub, MsgPlatform, PluginContext } from "../../core/type";
import IsTruthHandlerProvider from "../providers/command/istruth";
import MiniAppMessageHandlerProvider from "../providers/message/miniapp";

export const QQHandlerHub: HandlerHub = (ctx: Context, config: Config) => {
  ctx = ctx.platform(...MsgPlatform.asKoishi(MsgPlatform.QQ));

  const pluginCtx = PluginContext(ctx, config);

  MiniAppMessageHandlerProvider(pluginCtx);
  IsTruthHandlerProvider(pluginCtx);
};
