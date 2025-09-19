import { BaseOCR, PaddleOCR, TesseractOCR } from "@tiara/util/ocr";
import { Schema } from "koishi";

export * from "@tiara/util/ocr";

export interface BaseConfig {}

export const BaseConfig: Schema<BaseConfig> = Schema.object({}).description(
  "基础配置"
);

export type Config = BaseConfig &
  (BaseOCR.Config | PaddleOCR.Config | TesseractOCR.Config);

export const Config: Schema<Config> = Schema.intersect([
  // BaseConfig,
  BaseOCR.Config,
  Schema.union([PaddleOCR.Config, TesseractOCR.Config]),
]);
