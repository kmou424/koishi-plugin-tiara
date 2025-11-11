import { Next, Session } from "koishi";
import { MiddlewareFunc, PluginContext } from "../../core/type";
import { UserFn } from "../fn/user";

export const UserMiddleware =
  (ctx: PluginContext): MiddlewareFunc =>
  async (session: Session, next: Next) => {
    const { user, err } = await UserFn.findBindUser(session);
    if (!err && user) {
      ctx.uid = user.uid;
    }

    return await next();
  };
