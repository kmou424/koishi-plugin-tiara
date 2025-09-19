import { BaseOCR, Config } from "@tiara/config";
import { PluginContext, makePluginContext } from "@tiara/core/type";
import { MiniAppMessageHandlerHub } from "@tiara/handler/qq";
import { Context as KoishiContext } from "koishi";

export * from "@tiara/config";
export { AppName as name } from "@tiara/config";

export async function apply(koishiCtx: KoishiContext, config: Config) {
  const ctx = makePluginContext(koishiCtx, config);

  await init(ctx);

  // 小程序消息处理器
  MiniAppMessageHandlerHub(ctx);
}

export async function init(ctx: PluginContext) {
  await BaseOCR.precheck(ctx.cfg);
}
