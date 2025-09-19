import { Context as KoishiContext } from "koishi";
import { Config } from "./config";
import { PluginContext } from "./core/type";
import { IsTruthHandlerHub } from "./handler/common";
import { MiniAppMessageHandlerHub } from "./handler/qq";

import OCR from "./third-party/ocr";

export * from "./config";
export { AppName as name } from "./config";

export async function apply(koishiCtx: KoishiContext, config: Config) {
  const ctx = PluginContext(koishiCtx, config);

  await init(ctx);

  // 小程序消息处理器
  MiniAppMessageHandlerHub(ctx);
  // 求证事实处理器
  IsTruthHandlerHub(ctx);
}

export async function init(ctx: PluginContext) {
  await OCR.Precheck(ctx);
}
