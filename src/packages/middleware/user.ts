import { Session } from "koishi";
import { PluginContext } from "../../core/type";
import { UserFn } from "../fn/user";

export const UserMiddleware = (ctx: PluginContext) => {
  ctx().middleware(async (session: Session, next) => {
    const user = await UserFn.findBindUser(session);
    if (user) {
      ctx.uid = user.uid;
    }

    return await next();
  });
};
