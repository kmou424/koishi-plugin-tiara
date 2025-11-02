import { Session } from "koishi";
import { IFilter, PluginContext } from "../type";

export const FilterMiddleware = (ctx: PluginContext) => {
  ctx().middleware(async (session: Session, next) => {
    for (const filter of ctx.filters) {
      await (filter as IFilter).validate(ctx, session);
    }
    return await next();
  }, true);
};
