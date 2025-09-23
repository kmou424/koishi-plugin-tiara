import { PluginContext } from "../../core/type";
import { OCRConfig } from "./config";

export abstract class OCRProvider {
  abstract readonly enabled: boolean;

  abstract predict(
    ctx: PluginContext,
    options: PredictOptions
  ): Promise<string>;

  abstract precheck(ctx: PluginContext): Promise<boolean>;
}

export interface PredictOptions {
  config: OCRConfig;
  type: "url" | "base64";
  data: string;
}

export type PredictFunc = (
  ctx: PluginContext,
  options: PredictOptions
) => Promise<string>;

export type PrecheckFunc = (ctx: PluginContext) => Promise<boolean>;
