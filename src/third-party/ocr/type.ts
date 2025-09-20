import { PluginContext } from "../../core/type";
import { Config } from "./config";

export interface PredictOptions {
  config: Config;
  type: "url" | "base64";
  data: string;
}

export type PredictFunc = (
  ctx: PluginContext,
  options: PredictOptions
) => Promise<string>;

export type PrecheckFunc = (ctx: PluginContext) => Promise<boolean>;
