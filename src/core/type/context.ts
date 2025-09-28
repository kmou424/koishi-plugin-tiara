import { Context as KoishiContext, Logger } from "koishi";
import { env } from "process";
import { Config } from "../../config";
import { PluginName } from "../../consts";

export type PluginContext = {
  (): KoishiContext;
  cfg: Config;
  logger: Logger;
};

export const PluginContext = (
  koishiCtx: KoishiContext,
  cfg: Config
): PluginContext => {
  const ctx: PluginContext = (): KoishiContext => koishiCtx;
  ctx.cfg = cfg;
  ctx.logger = koishiCtx.logger(PluginName);

  if (env.NODE_ENV === "development") {
    ctx.logger.level = Logger.DEBUG;
  } else {
    ctx.logger.level = Logger.INFO;
  }

  return ctx;
};
