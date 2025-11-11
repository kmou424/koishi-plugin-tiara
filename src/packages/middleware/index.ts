import { MiddlewareFunc, PluginContext } from "../../core/type";

import { ExceptionMiddleware } from "./exception";
import { FilterMiddleware } from "./filter";
import { UserMiddleware } from "./user";

const Middlewares: ((ctx: PluginContext) => MiddlewareFunc)[] = [
  ExceptionMiddleware,
  UserMiddleware,
  FilterMiddleware,
];

export const initialize = (ctx: PluginContext) => {
  Middlewares.reverse().forEach((getMiddlewareFunc) =>
    ctx().middleware(getMiddlewareFunc(ctx), true)
  );
};

export default {
  initialize,
};
