import axios, { AxiosError } from "axios";
import { Schema } from "koishi";
import { PluginContext } from "../../../core/type";
import {
  ChatCompletionsFunc,
  ChatCompletionsRequest,
  ChatCompletionsResponse,
  ErrCode,
} from "../type";

export namespace xAI {
  export const Enabled = true;

  export interface WebSearchConfig {
    webSearch: true;
    mode: "auto" | "on" | "off";
    returnCitations: boolean;
    maxSearchResults: number;
  }

  export const WebSearchConfig: Schema<WebSearchConfig> = Schema.object({
    webSearch: Schema.const(true).required(),
    mode: Schema.union([
      Schema.const("auto").description("自动"),
      Schema.const("on").description("开启"),
      Schema.const("off").description("关闭"),
    ])
      .description("搜索模式")
      .default("auto"),
    returnCitations: Schema.boolean()
      .description("是否返回引用")
      .default(false),
    maxSearchResults: Schema.number()
      .role("slider")
      .max(50)
      .min(5)
      .step(1)
      .description("最大搜索结果数")
      .default(10),
  });

  export type Config = {
    provider: "xai";
    apiKey: string;
    model: "grok-3-mini" | "grok-4-0709" | "grok-3";
    webSearch: boolean;
  } & WebSearchConfig;

  export const Config: Schema<Config> = Schema.intersect([
    Schema.object({
      provider: Schema.const("xai"),
      apiKey: Schema.string()
        .role("secret")
        .description("xAI API 密钥")
        .default("")
        .required(),
      model: Schema.union([
        Schema.const("grok-3-mini"),
        Schema.const("grok-4-0709"),
        Schema.const("grok-3"),
      ])
        .description("xAI 模型")
        .default("grok-3-mini"),
      webSearch: Schema.boolean()
        .default(false)
        .description("是否启用网络搜索"),
    }),
    Schema.union([
      WebSearchConfig,
      Schema.object({}) as Schema<WebSearchConfig>,
    ]),
  ]);

  export const ChatCompletions: ChatCompletionsFunc = async (
    ctx: PluginContext,
    request: ChatCompletionsRequest
  ): Promise<ChatCompletionsResponse> => {
    const {
      apiKey,
      webSearch,
      mode,
      returnCitations,
      maxSearchResults,
      model,
    } = ctx.cfg.llm as Config;

    request["model"] = model;
    if (webSearch as boolean) {
      request["search_parameters"] = {
        mode,
        returnCitations,
        maxSearchResults,
      };
    }
    const resp: ChatCompletionsResponse = {
      message: [],
      citations: null,
      error: ErrCode.OK,
    };
    try {
      const axiosResp = await axios.post(
        "https://api.x.ai/v1/chat/completions",
        request,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 1000 * 60,
        }
      );
      ctx.logger.debug("xAI ChatCompletionsResponse", axiosResp.data);
      resp.message = [axiosResp.data.choices[0].message];
      resp.citations = axiosResp.data.citations;
      resp.usage = axiosResp.data.usage;
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 400:
            resp.error = ErrCode.BadRequest;
            break;
          case 408:
            resp.error = ErrCode.Timeout;
            break;
          default:
            resp.error = {
              code: error.response?.status ?? 0,
              message: error.response?.statusText ?? "",
            };
            break;
        }
      }
    }
    return resp;
  };
}
