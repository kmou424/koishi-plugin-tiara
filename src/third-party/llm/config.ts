import { Schema } from "koishi";
import LLMProviders, {
  OpenAICompatibleConfig,
  OpenAIConfig,
  xAIConfig,
} from "./providers";

export type LLMConfigOptions =
  | xAIConfig
  | OpenAIConfig
  | OpenAICompatibleConfig;

export const LLMConfigOptions: Schema<LLMConfigOptions> = Schema.union([
  xAIConfig,
  OpenAIConfig,
  OpenAICompatibleConfig,
]);

export type LLMConfig = {
  provider: "openai" | "openai-compatible" | "xai";
};

export const LLMConfig: Schema<LLMConfig> = Schema.object({
  provider: Schema.union([
    Schema.const("openai")
      .description("OpenAI")
      .disabled(!LLMProviders.openai.enabled),
    Schema.const("openai-compatible")
      .description("OpenAI-Compatible")
      .disabled(!LLMProviders["openai-compatible"].enabled),
    Schema.const("xai").description("xAI").disabled(!LLMProviders.xai.enabled),
  ])
    .description("LLM 提供商")
    .default("xai"),
}).description("LLM 配置");
