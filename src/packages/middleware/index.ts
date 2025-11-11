import { PluginContext } from "../../core/type";

import { ExceptionMiddleware } from "./exception";
import { FilterMiddleware } from "./filter";
import { UserMiddleware } from "./user";

const Middlewares: ((ctx: PluginContext) => void)[] = [
  ExceptionMiddleware,
  FilterMiddleware,
  UserMiddleware,
];

export const initialize = (ctx: PluginContext) => {
  Middlewares.forEach((registerMiddleware) => registerMiddleware(ctx));
};

export default {
  initialize,
};
