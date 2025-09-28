import { Context } from "koishi";
import { Config } from "./config";
import Global from "./core/global";
import { HandlerHub, PluginContext } from "./core/type";
import { QQHandlerHub } from "./handler/hub";
import { PluginHandlerHub } from "./handler/hub/plugin";
import migrate from "./migrate";
import OCR from "./third-party/ocr";

export * from "./config";
export { PluginName as name } from "./consts";

const HandlerHubs: HandlerHub[] = [new PluginHandlerHub(), new QQHandlerHub()];

export async function apply(ctx: Context, config: Config) {
  Global.Context = PluginContext(ctx, config);
  migrate(ctx);
  await initialize(Global.Context);

  HandlerHubs.forEach((hub) => {
    hub.Deploy(ctx, config);
  });
}

async function initialize(ctx: PluginContext) {
  await OCR.precheck(ctx);
}
