import { Command } from "koishi";
import {
  CommandHandlerFunc,
  CommandHandlerInput,
  HandlerProvider,
  PluginContext,
} from "../../../../core/type";
import { UserFilter } from "../../../../packages/filter";
import { UserFn } from "../../../../packages/fn/user";
import { User, UserQueries } from "../../../../packages/persistence/user";

export default class UserRegisterHandlerProvider extends HandlerProvider {
  Provide(ctx: PluginContext): void {
    ctx
      .createFilter()
      .when(UserFilter.isRegistered(false))
      .then(async (ctx: PluginContext) => {
        ctx()
          .command("register", "注册")
          .action(this.UserRegisterCommandHandler(ctx));
      });
  }

  private UserRegisterCommandHandler: CommandHandlerFunc = (
    ctx: PluginContext
  ): Command.Action => {
    return async (input: CommandHandlerInput) => {
      const session = input.session;
      if (ctx.uid) {
        if (UserQueries.findOne(ctx.uid)) {
          await session.send("您已注册，请勿重复注册。");
          return;
        }
      }

      let isAdmin = ctx.cfg.admins.some(
        (admin) =>
          admin.platform === session.platform && admin.id === session.userId
      );
      const { err, user } = await UserFn.createUser(
        session,
        isAdmin ? User.ACLs.Admin : User.ACLs.User
      );
      if (err) {
        throw err;
      }
      await session.send(`注册成功，您的用户 ID 为 ${user.uid}`);
    };
  };
}
