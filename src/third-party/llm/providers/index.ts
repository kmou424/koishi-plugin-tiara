import { LLMProvider } from "../type";
import { OpenAICompatibleProvider, OpenAIProvider } from "./openai";
import xAIProvider from "./xai";

export * from "./openai";
export * from "./xai";

export type LLMProviderType = "xai" | "openai" | "openai-compatible";

const LLMProviders: Record<LLMProviderType, LLMProvider> = {
  xai: new xAIProvider(),
  openai: new OpenAIProvider(),
  "openai-compatible": new OpenAICompatibleProvider(),
};

export default LLMProviders;
