import { Schema } from "koishi";
import { AdminConfig } from "../core/type/role";
import { LLMConfig, LLMConfigOptions } from "../third-party/llm";
import { OCRConfig, OCRConfigOptions } from "../third-party/ocr";

export const PluginName = "tiara";

export type Config = {
  admins: AdminConfig;
  ocr: OCRConfig | OCRConfigOptions;
  llm: LLMConfig | LLMConfigOptions;
};

export const Config: Schema<Config> = Schema.object({
  admins: AdminConfig,
  ocr: Schema.intersect([OCRConfig, OCRConfigOptions]),
  llm: Schema.intersect([LLMConfig, LLMConfigOptions]),
});
