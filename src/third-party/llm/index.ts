import * as LLMConfig from "./config";
import * as LLMGenerate from "./generate";
import { ChatCompletionsFunc } from "./type";

export * from "./type";

namespace LLM {
  export type Config = LLMConfig.Config;

  export const Config = LLMConfig.Config;

  export type ConfigOptions = LLMConfig.ConfigOptions;

  export const ConfigOptions = LLMConfig.ConfigOptions;

  export const ChatCompletions: ChatCompletionsFunc =
    LLMGenerate.ChatCompletions;
}

export default LLM;
