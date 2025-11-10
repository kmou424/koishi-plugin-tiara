import { Session } from "koishi";
import { PluginContext } from "../../core/type";

export const UserMiddleware = (ctx: PluginContext) => {
  ctx().middleware(async (session: Session, next) => {
    // TODO: 挂载用户UID到上下文

    return await next();
  });
};
