import { Next, Session } from "koishi";
import { MiddlewareFunc, PluginContext } from "../../core/type";

export const ExceptionMiddleware =
  (ctx: PluginContext): MiddlewareFunc =>
  async (session: Session, next: Next) => {
    try {
      return await next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        await session.send(`发生错误: ${error.message}`);
      } else {
        await session.send(`发生未知错误: ${error}`);
      }
    }
  };
