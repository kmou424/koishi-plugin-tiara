import { Config } from "@tiara/config";
import { PluginContext } from "@tiara/core/type";
import { MiniAppMessageHandlerHub } from "@tiara/handler/qq";
import { Context as KoishiContext } from "koishi";

import OCR from "@tiara/third-party/ocr";

export * from "@tiara/config";
export { AppName as name } from "@tiara/config";

export async function apply(koishiCtx: KoishiContext, config: Config) {
  const ctx = PluginContext(koishiCtx, config);

  await init(ctx);

  // 小程序消息处理器
  MiniAppMessageHandlerHub(ctx);
}

export async function init(ctx: PluginContext) {
  await OCR.Precheck(ctx);
}
