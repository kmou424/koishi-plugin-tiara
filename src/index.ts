import { Context, Schema } from "koishi";
import { message_callback } from "./handler/callback";

export const name = "tiara";

export interface Config {}

export const Config: Schema<Config> = Schema.object({});

export function apply(ctx: Context) {
  ctx.on("message", message_callback);
}
