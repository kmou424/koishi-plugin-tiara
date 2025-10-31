import { Context as KoishiContext, Logger } from "koishi";
import { Config } from "../../config";

export type PluginContext = {
  (): KoishiContext;
  cfg: Config;
  logger: Logger;
};
