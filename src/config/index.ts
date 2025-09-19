import { OCR } from "@tiara/util/ocr";
import { Schema } from "koishi";

export * from "@tiara/util/ocr";

export const AppName = "tiara";

export interface BaseConfig {}

export const BaseConfig: Schema<BaseConfig> = Schema.object({}).description(
  "基础配置"
);

export type Config = OCR.Config | OCR.ConfigOptions;

export const Config: Schema<Config> = Schema.intersect([
  // BaseConfig,
  OCR.Config,
  OCR.ConfigOptions,
]);
