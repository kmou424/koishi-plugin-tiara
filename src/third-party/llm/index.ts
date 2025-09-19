import * as LLMConfig from "./config";
import * as LLMGenerate from "./generate";
import { ChatCompletionsFunc } from "./type";

export * from "./type";

namespace LLM {
  export type Config = LLMConfig.Config;

  export const Config = LLMConfig.Config;

  export type ProviderConfigOptions = LLMConfig.ProviderConfigOptions;

  export const ProviderConfigOptions = LLMConfig.ProviderConfigOptions;

  export const ChatCompletions: ChatCompletionsFunc =
    LLMGenerate.ChatCompletions;
}

export default LLM;
