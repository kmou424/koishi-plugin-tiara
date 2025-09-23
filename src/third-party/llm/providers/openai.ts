import { Schema } from "koishi";
import { CoreUtil } from "../../../core";
import { PluginContext } from "../../../core/type";
import {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
  LLMProvider,
} from "../type";

export interface OpenAIWebSearchConfig {
  webSearch: true;
}

export const OpenAIWebSearchConfig: Schema<OpenAIWebSearchConfig> =
  Schema.object({
    webSearch: Schema.const(true).required(),
  }).hidden();

export type OpenAIConfig = {
  provider: "openai";
  apiKey: string;
  webSearch: boolean;
} & OpenAIWebSearchConfig;

export const OpenAIConfig: Schema<OpenAIConfig> = Schema.intersect([
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
    OpenAIWebSearchConfig,
    Schema.object({}) as Schema<OpenAIWebSearchConfig>,
  ]),
]);

export class OpenAIProvider extends LLMProvider {
  readonly enabled = false;

  async chatCompletions(
    ctx: PluginContext,
    request: ChatCompletionsRequest
  ): Promise<ChatCompletionsResponse> {
    throw CoreUtil.Runtime.TODO;
  }
}

export interface OpenAICompatibleWebSearchConfig {
  provider: "openai-compatible";
  webSearch: false;
}

export const OpenAICompatibleWebSearchConfig: Schema<OpenAICompatibleWebSearchConfig> =
  Schema.object({
    provider: Schema.const("openai-compatible").required(),
    webSearch: Schema.const(false).required(),
  });

export type OpenAICompatibleConfig = {
  provider: "openai-compatible";
  apiKey: string;
  webSearch: boolean;
} & OpenAICompatibleWebSearchConfig;

export const OpenAICompatibleConfig: Schema<OpenAICompatibleConfig> =
  Schema.intersect([
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
    }),
    Schema.union([
      OpenAICompatibleWebSearchConfig,
      Schema.object({}) as Schema<OpenAICompatibleWebSearchConfig>,
    ]),
  ]);

export class OpenAICompatibleProvider extends LLMProvider {
  readonly enabled = false;

  async chatCompletions(
    ctx: PluginContext,
    request: ChatCompletionsRequest
  ): Promise<ChatCompletionsResponse> {
    throw CoreUtil.Runtime.TODO;
  }
}
