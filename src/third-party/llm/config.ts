import { Schema } from "koishi";
import { OpenAI, OpenAICompatible, xAI } from "./providers";

export interface Config {
  provider: "openai" | "openai-compatible" | "xai";
}

export const Config: Schema<Config> = Schema.object({
  provider: Schema.union([
    Schema.const("openai").description("OpenAI").disabled(!OpenAI.Enabled),
    Schema.const("openai-compatible")
      .description("OpenAI-Compatible")
      .disabled(!OpenAICompatible.Enabled),
    Schema.const("xai").description("xAI").disabled(!xAI.Enabled),
  ])
    .description("LLM 提供商")
    .default("xai"),
}).description("AI 提供商配置");

export type ProviderConfigOptions =
  | xAI.Config
  | OpenAI.Config
  | OpenAICompatible.Config;

export const ProviderConfigOptions: Schema<ProviderConfigOptions> =
  Schema.union([xAI.Config, OpenAI.Config, OpenAICompatible.Config]);
