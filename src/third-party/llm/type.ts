import { PluginContext } from "@tiara/core/type";

export enum MessageRole {
  User = "user",
  Assistant = "assistant",
  System = "system",
}

export interface ErrCodeWithMessage {
  code: number;
  message: string;
}

export const ErrCode: Record<string, ErrCodeWithMessage> = {
  OK: {
    code: 200,
    message: "OK",
  },
  Timeout: {
    code: 408,
    message: "Timeout",
  },
  BadRequest: {
    code: 400,
    message: "Bad Request",
  },
};

export interface Message {
  role: MessageRole;
  content: string;
  reasoning?: string;
}

export interface ChatCompletionsRequest {
  messages: Message[];
  [key: string]: any;
}

export interface ChatCompletionsResponse {
  message: Message[];
  citations?: string[];
  error?: ErrCodeWithMessage;
  [key: string]: any;
}

export type ChatCompletionsFunc = (
  ctx: PluginContext,
  request: ChatCompletionsRequest
) => Promise<ChatCompletionsResponse>;
