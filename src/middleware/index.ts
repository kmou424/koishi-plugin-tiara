import { PluginContext } from "../core/type";

import { FilterMiddleware } from "./filter";
import { UserMiddleware } from "./user";

const Middlewares: ((ctx: PluginContext) => void)[] = [
  FilterMiddleware,
  UserMiddleware,
];

export const initialize = (ctx: PluginContext) => {
  Middlewares.forEach((registerMiddleware) => registerMiddleware(ctx));
};

export default {
  initialize,
};
