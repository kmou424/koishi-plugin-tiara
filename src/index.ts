import { Context } from "koishi";
import { Config } from "./config";

import { QQHandlerHub } from "./handler/hub";
import initializer from "./initializer";

export * from "./config";
export { AppName as name } from "./config";

export async function apply(ctx: Context, config: Config) {
  await initializer(ctx, config);

  new QQHandlerHub(ctx, config);
}
