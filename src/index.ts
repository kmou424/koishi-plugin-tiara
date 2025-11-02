import { Context } from "koishi";
import { Config } from "./config";
import { createPluginContext } from "./core/context";
import Global from "./core/global";
import { SchemaRegistry } from "./core/schema";
import { HandlerHub, PluginContext } from "./core/type";
import { PluginHandlerHub, QQHandlerHub } from "./handler/hub";
import { initPropertyMap } from "./libs/property";
import { RevocableMessageCache } from "./libs/revoke";
import Middleware from "./middleware";
import Properties from "./properties";
import OCR from "./third-party/ocr";

// auto register schemas
import "./libs/property";
import "./libs/revoke";

export * from "./config";
export { PluginName as name } from "./consts";

const HandlerHubs: HandlerHub[] = [new PluginHandlerHub(), new QQHandlerHub()];

export const inject = {
  required: ["database"],
};

export async function apply(ctx: Context, config: Config) {
  Global.Context = createPluginContext(ctx, config);

  await initialize(Global.Context);

  Middleware.initialize(Global.Context);

  HandlerHubs.forEach((hub) => {
    hub.Deploy(Global.Context, config);
  });
}

async function initialize(ctx: PluginContext) {
  SchemaRegistry.migrate(ctx());
  await OCR.precheck(ctx);
  RevocableMessageCache.startScanner(ctx);
  await initPropertyMap(Properties);
}
