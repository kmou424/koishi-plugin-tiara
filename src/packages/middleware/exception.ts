import { Session } from "koishi";
import { PluginContext } from "../../core/type";

export const ExceptionMiddleware = (ctx: PluginContext) => {
  ctx().middleware(async (session: Session, next) => {
    try {
      return await next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        await session.send(`发生错误: ${error.message}`);
      } else {
        await session.send(`发生未知错误: ${error}`);
      }
    }
  });
};
