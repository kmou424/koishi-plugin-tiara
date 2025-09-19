import { PluginContext } from "../../core/type";
import { xAI } from "./providers";
import {
  ChatCompletionsFunc,
  ChatCompletionsRequest,
  ChatCompletionsResponse,
} from "./type";

export const ChatCompletions: ChatCompletionsFunc = async (
  ctx: PluginContext,
  options: ChatCompletionsRequest
): Promise<ChatCompletionsResponse> =>
  await {
    xai: xAI.ChatCompletions,
  }[ctx.cfg.provider](ctx, options);
