import { HandlerProvider, PluginContext } from "../../../../core/type";
import { UserFilter } from "../../../../packages/filter";

import UserRegisterHandlerProvider from "./register";

export default class UserHandlerProvider extends HandlerProvider {
  Provide(ctx: PluginContext): void {
    ctx
      .createFilter()
      .when(UserFilter.isRegistered(false))
      .then(async (ctx: PluginContext) => {
        new UserRegisterHandlerProvider().Provide(ctx);
      });
  }
}
