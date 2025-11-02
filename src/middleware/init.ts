import { PluginContext } from "../core/type";
import { FilterMiddleware } from "./filter";

const Middlewares: ((ctx: PluginContext) => void)[] = [FilterMiddleware];

export const initialize = (ctx: PluginContext) => {
  Middlewares.forEach((registerMiddleware) => registerMiddleware(ctx));
};
