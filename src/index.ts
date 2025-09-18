import { MiniAppMessageHandlerHub } from "@tiara/handler/qq";
import { Context, Schema } from "koishi";

export const name = "tiara";

export interface Config {}

export const Config: Schema<Config> = Schema.object({});

export function apply(ctx: Context) {
  // 小程序消息处理器
  MiniAppMessageHandlerHub(ctx);
}
