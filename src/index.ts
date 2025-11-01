import { Context } from "koishi";
import { Config } from "./config";
import { createPluginContext } from "./core/context";
import Global from "./core/global";
import * as Middlewares from "./core/middlewares";
import { HandlerHub, PluginContext } from "./core/type";
import { PluginHandlerHub, QQHandlerHub } from "./handler/hub";
import { initPropertyMap } from "./libs/property";
import { RevocableMessageCache } from "./libs/revoke";
import migrate from "./migrate";
import Properties from "./properties";
import OCR from "./third-party/ocr";

export * from "./config";
export { PluginName as name } from "./consts";

const HandlerHubs: HandlerHub[] = [new PluginHandlerHub(), new QQHandlerHub()];

export const inject = {
  required: ["database"],
};

export async function apply(ctx: Context, config: Config) {
  Global.Context = createPluginContext(ctx, config);
  migrate(ctx);
  await initialize(Global.Context);

  Middlewares.initialize(Global.Context);

  HandlerHubs.forEach((hub) => {
    hub.Deploy(Global.Context, config);
  });
}

async function initialize(ctx: PluginContext) {
  await OCR.precheck(ctx);
  RevocableMessageCache.startScanner(ctx);
  await initPropertyMap(Properties);
}
