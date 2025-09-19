import LLM from "@tiara/third-party/llm";
import OCR from "@tiara/third-party/ocr";
import { Schema } from "koishi";

export const AppName = "tiara";

export interface BaseConfig {}

export const BaseConfig: Schema<BaseConfig> = Schema.object({}).description(
  "基础配置"
);

export type Config =
  | (OCR.Config & LLM.Config)
  | (OCR.ConfigOptions & LLM.ProviderConfigOptions);

export const Config: Schema<Config> = Schema.intersect([
  // BaseConfig,
  OCR.Config,
  OCR.ConfigOptions,
  LLM.Config,
  LLM.ProviderConfigOptions,
]);
