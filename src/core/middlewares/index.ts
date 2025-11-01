import { Session } from "koishi";
import { IFilter, PluginContext } from "../type";

const FiltersMiddleware = (ctx: PluginContext) => {
  ctx().middleware(async (session: Session, next) => {
    for (const filter of ctx.filters) {
      await (filter as IFilter).validate(ctx, session);
    }
    return await next();
  }, true);
};

const Middlewares: ((ctx: PluginContext) => void)[] = [FiltersMiddleware];

export const initialize = (ctx: PluginContext) => {
  Middlewares.forEach((registerMiddleware) => registerMiddleware(ctx));
};
