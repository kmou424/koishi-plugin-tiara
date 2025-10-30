import { Context } from "koishi";
import { Config } from "./config";
import Global from "./core/global";
import { ORM } from "./core/orm";
import { HandlerHub, PluginContext } from "./core/type";
import { PluginHandlerHub, QQHandlerHub } from "./handler/hub";
import { initPropertyMap } from "./libs/property";
import { RevocableMessageCache } from "./libs/revoke";
import Properties from "./properties";
import { Repositories } from "./repositories";
import OCR from "./third-party/ocr";

export * from "./config";
export { PluginName as name } from "./consts";

const HandlerHubs: HandlerHub[] = [new PluginHandlerHub(), new QQHandlerHub()];

export const inject = {
  required: ["database"],
};

export async function apply(ctx: Context, config: Config) {
  Global.Context = PluginContext(ctx, config);
  Global.ORM = new ORM(Global.Context);

  await initialize(Global.Context);

  HandlerHubs.forEach((hub) => {
    hub.Deploy(ctx, config);
  });

  // 清理资源
  ctx.on("dispose", async () => {
    await Repositories.dispose(Global.Context);
  });
}

async function initialize(ctx: PluginContext) {
  await Repositories.initialize(ctx);
  await OCR.precheck(ctx);
  RevocableMessageCache.startScanner(ctx);
  initPropertyMap(Properties);
}
