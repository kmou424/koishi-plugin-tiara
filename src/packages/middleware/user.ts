import { Next, Session } from "koishi";
import { MiddlewareFunc, PluginContext } from "../../core/type";
import { UserFn } from "../fn/user";

export const UserMiddleware =
  (ctx: PluginContext): MiddlewareFunc =>
  async (session: Session, next: Next) => {
    const { platform, userId } = session;
    const { user, err } = await UserFn.findBindUser(session);
    if (!err) {
      ctx.uid = user.uid;
    } else {
      ctx.logger.error(
        `failed to find bind user<${platform}:${userId}>: ${err.message}`
      );
      return await next();
    }

    return await next();
  };
