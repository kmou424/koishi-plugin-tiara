import { Context } from "koishi";
import { Config } from "./config";
import { PluginContext } from "./core/type";
import OCR from "./third-party/ocr";

export default async function initializer(ctx: Context, config: Config) {
  const pluginCtx = PluginContext(ctx, config);
  await OCR.Precheck(pluginCtx);
}
