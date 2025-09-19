import { h } from "koishi";
import { Message } from "@tiara/core/protocol";
import {
  HandlerHub,
  MessageHandlerFunc,
  MsgContent,
  MsgPlatform,
  MsgType,
  PluginContext,
} from "@tiara/core/type";
import { BilibiliAPI, BilibiliTool } from "@tiara/third-party/bilibili";
import { formatDuration } from "@tiara/util/time";
import Handlebars from "handlebars";

export const MiniAppMessageHandlerHub: HandlerHub = (ctx: PluginContext) => {
  ctx()
    .platform(...MsgPlatform.asKoishi(MsgPlatform.QQ))
    .on("message", (session) => {
      handlerThis(new Message(session));
    });
};

const handlerThis: MessageHandlerFunc & {
  isMiniappMessage: (item: MsgContent) => boolean;

  handleBilibili: (msg: Message, qqdocurl: string) => Promise<void>;
} = async (msg: Message) => {
  msg.content.forEach(async (item) => {
    // 小程序消息
    if (!handlerThis.isMiniappMessage(item)) return;

    const qqdocurl = item.data?.["meta"]?.["detail_1"]?.["qqdocurl"] as string;
    if (!qqdocurl) return;

    const url = new URL(qqdocurl);
    switch (url.hostname) {
      case "b23.tv":
        handlerThis.handleBilibili(msg, qqdocurl);
        break;
      default:
        break;
    }
  });
};

handlerThis.template = {
  templates: {
    video_info: `{{video.title}} - [{{video.owner.name}}]
时长: {{duration}}
{{#if desc_trimmed}}
简介: {{desc_trimmed}}
{{/if}}
链接: {{url}}
`,
  },
  render(args: Object): string {
    return Handlebars.compile(this.templates.video_info)(args);
  },
};

handlerThis.isMiniappMessage = (item: MsgContent) => {
  return (
    item.type === MsgType.Json &&
    (item.data?.["app"] as string).includes("miniapp")
  );
};

handlerThis.handleBilibili = async (msg: Message, qqdocurl: string) => {
  const url = await BilibiliTool.parseB23url(qqdocurl);
  if (!url) {
    return;
  }
  const bvid = BilibiliTool.getBVFromUrl(url);
  const video = await BilibiliAPI.getVideoInfo(bvid);

  await msg.session.send([
    h("img", { src: video.pic }),
    handlerThis.template.render({
      duration: formatDuration(video.duration),
      desc_trimmed:
        video.desc.length > 50 ? video.desc.slice(0, 50) + "..." : video.desc,
      url: url,
      video,
    }),
    <>
      由 <at id={msg.session.event.member.user?.id} /> 分享
    </>,
  ]);
  await msg.deleteMsg();
};
