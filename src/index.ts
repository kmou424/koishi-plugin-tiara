import { Context } from "koishi";
import { Config } from "./config";
import Global from "./core/global";
import { HandlerHub, PluginContext } from "./core/type";
import { QQHandlerHub } from "./handler/hub";
import OCR from "./third-party/ocr";

export * from "./config";
export { PluginName as name } from "./config";

const HandlerHubs: HandlerHub[] = [new QQHandlerHub()];

export async function apply(ctx: Context, config: Config) {
  Global.Context = PluginContext(ctx, config);
  await initialize(Global.Context);

  HandlerHubs.forEach((hub) => {
    hub.Deploy(ctx, config);
  });
}

async function initialize(ctx: PluginContext) {
  await OCR.Precheck(ctx);
}
