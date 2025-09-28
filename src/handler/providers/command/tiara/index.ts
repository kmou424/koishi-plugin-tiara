import { Command } from "koishi";
import { CoreUtil } from "../../../../core";
import {
  CommandHandlerFunc,
  CommandHandlerInput,
  HandlerProvider,
  PluginContext,
} from "../../../../core/type";
import { TiaraCommand } from "./consts";
import PropertyHandlerProvider from "./property";
import RevokeCommandProvider from "./revoke";

class TiaraHandlerProvider extends HandlerProvider {
  Provide(ctx: PluginContext): void {
    CoreUtil.Permission.AdminContext(ctx)
      .command(TiaraCommand, "Tiara 主命令")
      .action(this.TiaraCommandHandler(ctx));

    new PropertyHandlerProvider().Provide(ctx);
    new RevokeCommandProvider().Provide(ctx);
  }

  private TiaraCommandHandler: CommandHandlerFunc = (
    ctx: PluginContext
  ): Command.Action => {
    return async (input: CommandHandlerInput) => {
      await input.session.execute(`help ${TiaraCommand}`);
    };
  };
}

export default TiaraHandlerProvider;
