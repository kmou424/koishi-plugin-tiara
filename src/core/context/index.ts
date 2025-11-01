import { Context as KoishiContext, Logger } from "koishi";
import { env } from "process";
import { Config } from "../../config";
import { PluginName } from "../../consts";
import { createBaseFilter } from "../advanced/filter";
import { PluginContext } from "../type";

export const createPluginContext = (
  koishiCtx: KoishiContext,
  cfg: Config
): PluginContext => {
  let rCtx = koishiCtx;
  const ctx: PluginContext = (): KoishiContext => rCtx;
  ctx.cfg = cfg;
  ctx.logger = koishiCtx.logger(PluginName);
  ctx.filters = [];

  if (env.NODE_ENV === "development") {
    ctx.logger.level = Logger.DEBUG;
  } else {
    ctx.logger.level = Logger.INFO;
  }

  ctx.createFilter = () => {
    const filter = createBaseFilter();
    ctx.filters.push(filter);
    return filter;
  };

  ctx.override = (overrideCtx: KoishiContext) => {
    rCtx = overrideCtx;
  };

  return ctx;
};
