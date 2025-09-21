import { Schema } from "koishi";
export namespace OpenAI {
  export const Enabled = false;

  export interface WebSearchConfig {
    webSearch: true;
  }

  export const WebSearchConfig: Schema<WebSearchConfig> = Schema.object({
    webSearch: Schema.const(true).required(),
  }).hidden();

  export type Config = {
    provider: "openai";
    apiKey: string;
    webSearch: boolean;
  } & WebSearchConfig;

  export const Config: Schema<Config> = Schema.intersect([
    Schema.object({
      provider: Schema.const("openai").required(),
      apiKey: Schema.string()
        .role("secret")
        .description("OpenAI API 密钥")
        .default("")
        .required(),
      webSearch: Schema.boolean()
        .default(false)
        .description("是否启用网络搜索")
        .required(),
    }),
    Schema.union([
      WebSearchConfig,
      Schema.object({}) as Schema<WebSearchConfig>,
    ]),
  ]);
}

export namespace OpenAICompatible {
  export const Enabled = false;

  export interface WebSearchConfig {
    provider: "openai-compatible";
    webSearch: false;
  }

  export const WebSearchConfig: Schema<WebSearchConfig> = Schema.object({
    provider: Schema.const("openai-compatible").required(),
    webSearch: Schema.const(false).required(),
  });

  export type Config = {
    provider: "openai-compatible";
    apiKey: string;
    webSearch: boolean;
  } & WebSearchConfig;

  export const Config: Schema<Config> = Schema.intersect([
    Schema.object({
      provider: Schema.const("openai-compatible").required(),
      apiKey: Schema.string()
        .role("secret")
        .description("OpenAI-Compatible API 密钥")
        .default("")
        .required(),
      webSearch: Schema.boolean()
        .default(false)
        .description("是否启用网络搜索")
        .disabled()
        .hidden(),
    }).disabled(!Enabled),
    Schema.union([
      WebSearchConfig,
      Schema.object({}) as Schema<WebSearchConfig>,
    ]),
  ]);
}
