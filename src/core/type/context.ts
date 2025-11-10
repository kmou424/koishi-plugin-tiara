import { Context as KoishiContext, Logger } from "koishi";
import { Config } from "../../config";
import { Filter } from "./advanced";

export type PluginContext = {
  (): KoishiContext;
  cfg: Config;
  logger: Logger;
  filters: Filter[];
  uid: number | null;

  createFilter: () => Filter;
  override: (overrideCtx: KoishiContext) => void;
};
