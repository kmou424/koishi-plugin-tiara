import { Schema } from "koishi";
import LLM from "../third-party/llm";
import OCR from "../third-party/ocr";

export const PluginName = "tiara";

export type Config = {
  ocr: OCR.Config | OCR.ConfigOptions;
  llm: LLM.Config | LLM.ConfigOptions;
};

export const Config: Schema<Config> = Schema.object({
  ocr: Schema.intersect([OCR.Config, OCR.ConfigOptions]),
  llm: Schema.intersect([LLM.Config, LLM.ConfigOptions]),
});
