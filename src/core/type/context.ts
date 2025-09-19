import { AppName, Config } from "@tiara/config";
import { Context as KoishiContext, Logger } from "koishi";
import { env } from "process";

export type PluginContext = {
  (): KoishiContext;
  cfg: Config;
  logger: Logger;
};

export const makePluginContext = (
  koishiCtx: KoishiContext,
  cfg: Config
): PluginContext => {
  const ctx: PluginContext = (): KoishiContext => koishiCtx;
  ctx.cfg = cfg;
  ctx.logger = koishiCtx.logger(AppName);

  if (env.NODE_ENV === "development") {
    ctx.logger.level = Logger.DEBUG;
  } else {
    ctx.logger.level = Logger.INFO;
  }

  return ctx;
};
