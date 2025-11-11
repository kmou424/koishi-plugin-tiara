import { Next, Session } from "koishi";
import { IFilter, MiddlewareFunc, PluginContext } from "../../core/type";

export const FilterMiddleware =
  (ctx: PluginContext): MiddlewareFunc =>
  async (session: Session, next: Next) => {
    for (const filter of ctx.filters) {
      await (filter as IFilter).validate(ctx, session);
    }
    return await next();
  };
