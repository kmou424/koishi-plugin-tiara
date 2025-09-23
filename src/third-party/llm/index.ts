import { PluginContext } from "../../core/type";
import LLMProviders from "./providers";
import {
  ChatCompletionsFunc,
  ChatCompletionsRequest,
  ChatCompletionsResponse,
} from "./type";

export * from "./config";
export * from "./type";

class LLM {
  public static chatCompletions: ChatCompletionsFunc = async (
    ctx: PluginContext,
    options: ChatCompletionsRequest
  ): Promise<ChatCompletionsResponse> =>
    await LLMProviders[ctx.cfg.llm.provider].chatCompletions(ctx, options);
}

export default LLM;
