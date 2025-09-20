import {
  CommandHandlerInput,
  HandlerProvider,
  PluginContext,
} from "../../../../core/type";
import { Command, h } from "koishi";

import LLM, {
  ChatCompletionsRequest,
  ErrCode,
  MessageRole,
} from "../../../../third-party/llm";
import OCR from "../../../../third-party/ocr";

export const IsTruthHandlerProvider: HandlerProvider = (ctx: PluginContext) => {
  ctx()
    .command("istruth", "使用 AI 求证事实")
    .option("question", "-q <附带提问>", {
      type: "string",
    })
    .action(IsTruthCommandHandler(ctx));
};

function IsTruthCommandHandler(ctx: PluginContext): Command.Action {
  return async (input: CommandHandlerInput) => {
    const elements = h.parse(input.args.join("\n"));
    let content: string;
    try {
      content = (
        await IsTruthCommandHandler.resolveElements(ctx, elements)
      ).join("\n");
    } catch (error) {
      input.session.send(`发生错误: 解析输入失败: ${error}`);
      return;
    }
    if (content.length === 0) {
      input.session.send("无效的输入");
      return;
    }
    if (input.options.question) {
      content += `\n\n用户提问：${input.options.question}`;
    }
    ctx.logger.debug(content);
    const req: ChatCompletionsRequest = {
      messages: [
        {
          role: MessageRole.System,
          content: IsTruthCommandHandler.SystemPrompt,
        },
        {
          role: MessageRole.User,
          content: content,
        },
      ],
    };
    req["temperature"] = 0.3;
    const llmResp = await LLM.ChatCompletions(ctx, req);
    ctx.logger.debug("ChatCompletionsResponse", llmResp);

    if (llmResp.error != ErrCode.OK) {
      input.session.send(
        `发生错误: [${llmResp.error.code}] ${llmResp.error.message}`
      );
      return;
    }
    if (!llmResp.message || llmResp.message.length === 0) {
      input.session.send("发生错误: 模型返回空结果");
      return;
    }

    const llmRespContent = llmResp.message
      .map((message) => message.content)
      .join("\n");
    input.session.send([
      llmRespContent,
      "\n",
      <>
        由 <at id={input.session.event.member.user?.id} /> 提问
      </>,
    ]);
  };
}

namespace IsTruthCommandHandler {
  export const SystemPrompt = `你是一位严谨的事实核查员。你的任务是针对用户提供的材料（可能是新闻、实事或是来自社交平台截图，以及OCR识别结果），通过搜索交叉验证多个可信信源(权威媒体、政府机构、学术机构等，搜索社交媒体时注意核验用户账号身份)，核查其真实性。如果材料最后附有用户提问，请优先回答。
回答格式（为适配社交平台，请严格遵守）：
第一行：给出一句话表达材料真实性或倾向性的明确结论。
后续行：列出一或多条核心事实与证据，标注出材料中对应的段落(用括号附上信源)，并给出为什么可信/不可信的理由。
要求：内容简洁、干练，全程禁用任何Markdown或其他特殊格式。`;

  export const resolveElements = async (
    ctx: PluginContext,
    elements: h[]
  ): Promise<string[]> =>
    await Promise.all(
      elements.map(
        async (element) =>
          await IsTruthCommandHandler.resolveElement(ctx, element)
      )
    );

  export const resolveElement = async (
    ctx: PluginContext,
    element: h
  ): Promise<string> => {
    switch (element.type) {
      case "text":
        return element.attrs.content;
      case "img":
        const { data } = await ctx().http.file(element.attrs.src);
        const base64 = Buffer.from(data).toString("base64");
        try {
          return await OCR.Predict(ctx, {
            config: ctx.cfg,
            type: "base64",
            data: base64,
          });
        } catch (error) {
          throw new Error(`OCR识别失败: ${error}`);
        }
      default:
        return "";
    }
  };
}
