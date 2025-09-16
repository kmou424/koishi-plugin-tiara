import Handlebars from "handlebars";
import { h } from "koishi";
import { Message } from "../../../core/protocol";
import { MsgChannel, MsgType } from "../../../core/protocol/type";
import { Template } from "../../../core/template";
import { format_duration } from "../../../core/util/time";
import { BilibiliTool } from "../../../third-party/bilibili";
import { BilibiliAPI } from "../../../third-party/bilibili/api";
import { MessageHandler } from "../../type";

class VideoInfoTemplate implements Template {
  readonly content = `{{video.title}} - [{{video.owner.name}}]
时长: {{duration}}
{{#if desc_trimmed}}
简介: {{desc_trimmed}}
{{/if}}
链接: {{url}}
`;
  render(args: Object): string {
    return Handlebars.compile(this.content)(args);
  }
}

class JSONMessageHandler implements MessageHandler {
  AccpetType = MsgType.Json;
  AccpetChannel = MsgChannel.QQ;

  async handle(msg: Message): Promise<void> {
    msg.content.forEach(async (item) => {
      // 小程序消息
      if (
        item.type === MsgType.Json &&
        (item.data?.["app"] as string).includes("miniapp")
      ) {
        const qqdocurl = item.data?.["meta"]?.["detail_1"]?.[
          "qqdocurl"
        ] as string;
        if (qqdocurl) {
          const url = new URL(qqdocurl);
          if (url.hostname === "b23.tv") {
            this.handle_bilibili_url(msg, qqdocurl);
          }
        }
      }
    });
  }

  async handle_bilibili_url(msg: Message, qqdocurl: string) {
    const url = await BilibiliTool.parse_b23url(qqdocurl);
    if (url) {
      const bvid = BilibiliTool.get_bv_from_url(url);
      const video = await BilibiliAPI.get_video_info(bvid);

      await msg.session.send([
        h("img", { src: video.pic }),
        new VideoInfoTemplate().render({
          duration: format_duration(video.duration),
          desc_trimmed:
            video.desc.length > 50
              ? video.desc.slice(0, 50) + "..."
              : video.desc,
          url: url,
          video,
        }),
        <>
          由 <at id={msg.session.event.member.user?.id} /> 分享
        </>,
      ]);
      await msg.delete_msg();
    }
  }
}

export { JSONMessageHandler };
