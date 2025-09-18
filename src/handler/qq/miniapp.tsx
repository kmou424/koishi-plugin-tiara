import { Context, h } from "koishi";
import { Message, make_message } from "@tiara/core/protocol";
import {
  MessageHandler,
  MsgContent,
  MsgPlatform,
  MsgType,
} from "@tiara/core/type";
import { BilibiliAPI, BilibiliTool } from "@tiara/third-party/bilibili";
import { format_duration } from "@tiara/util/time";
import Handlebars from "handlebars";

export const MiniAppMessageHandlerHub = (ctx: Context) => {
  ctx
    .platform(...MsgPlatform.as_koishi(MsgPlatform.QQ))
    .on("message", (session) => {
      handlerThis(make_message(session));
    });
};

const handlerThis: MessageHandler & {
  is_miniapp_message: (item: MsgContent) => boolean;

  handle_bilibili: (msg: Message, qqdocurl: string) => Promise<void>;
} = async (msg: Message) => {
  msg.content.forEach(async (item) => {
    // 小程序消息
    if (!handlerThis.is_miniapp_message(item)) return;

    const qqdocurl = item.data?.["meta"]?.["detail_1"]?.["qqdocurl"] as string;
    if (!qqdocurl) return;

    const url = new URL(qqdocurl);
    switch (url.hostname) {
      case "b23.tv":
        handlerThis.handle_bilibili(msg, qqdocurl);
        break;
      default:
        break;
    }
  });
};

handlerThis.template = {
  content: `{{video.title}} - [{{video.owner.name}}]
时长: {{duration}}
{{#if desc_trimmed}}
简介: {{desc_trimmed}}
{{/if}}
链接: {{url}}
`,
  render(args: Object): string {
    return Handlebars.compile(this.content)(args);
  },
};

handlerThis.is_miniapp_message = (item: MsgContent) => {
  return (
    item.type === MsgType.Json &&
    (item.data?.["app"] as string).includes("miniapp")
  );
};

handlerThis.handle_bilibili = async (msg: Message, qqdocurl: string) => {
  const url = await BilibiliTool.parse_b23url(qqdocurl);
  if (!url) {
    return;
  }
  const bvid = BilibiliTool.get_bv_from_url(url);
  const video = await BilibiliAPI.get_video_info(bvid);

  await msg.session.send([
    h("img", { src: video.pic }),
    handlerThis.template.render({
      duration: format_duration(video.duration),
      desc_trimmed:
        video.desc.length > 50 ? video.desc.slice(0, 50) + "..." : video.desc,
      url: url,
      video,
    }),
    <>
      由 <at id={msg.session.event.member.user?.id} /> 分享
    </>,
  ]);
  await msg.delete_msg();
};
