import { Command, h } from "koishi";
import { CoreUtil } from "../../../../core";
import {
  CommandHandlerFunc,
  CommandHandlerInput,
  HandlerProvider,
  PluginContext,
} from "../../../../core/type";
import { RevokeListener } from "../../../../libs/revoke";

const TiaraRevokeCommand = "revoke";

class RevokeCommandProvider extends HandlerProvider {
  Provide(ctx: PluginContext): void {
    CoreUtil.Permission.AdminContext(ctx).command(
      TiaraRevokeCommand,
      "撤回事件管理器"
    );

    CoreUtil.Permission.AdminContext(ctx)
      .command(
        `${TiaraRevokeCommand}.listen <atMessage:string>`,
        "监听并补档用户撤回消息"
      )
      .action(this.RevokeListenCommandHandler(ctx));

    CoreUtil.Permission.AdminContext(ctx)
      .command(
        `${TiaraRevokeCommand}.unlisten <atMessage:string>`,
        "停止监听并补档用户撤回消息"
      )
      .action(this.RevokeUnlistenCommandHandler(ctx));
  }

  private RevokeListenCommandHandler: CommandHandlerFunc = (
    ctx: PluginContext
  ): Command.Action => {
    return async (input: CommandHandlerInput, atMessage: string) => {
      const messages = h.parse(atMessage);
      if (messages.length !== 1) {
        return;
      }
      const message = messages[0];
      if (message.type !== "at") {
        return;
      }
      await ctx().database.upsert(RevokeListener.TableName, [
        {
          platform: input.session.platform,
          userId: message.attrs.id,
        },
      ]);
      await input.session.send([
        <>
          已开始监听 <at id={message.attrs.id} /> 的撤回消息
        </>,
      ]);
    };
  };

  private RevokeUnlistenCommandHandler: CommandHandlerFunc = (
    ctx: PluginContext
  ): Command.Action => {
    return async (input: CommandHandlerInput, atMessage: string) => {
      const messages = h.parse(atMessage);
      if (messages.length !== 1) {
        return;
      }
      const message = messages[0];
      if (message.type !== "at") {
        return;
      }
      await ctx().database.remove(RevokeListener.TableName, {
        platform: input.session.platform,
        userId: message.attrs.id,
      });
      await input.session.send([
        <>
          已停止监听 <at id={message.attrs.id} /> 的撤回消息
        </>,
      ]);
    };
  };
}

export default RevokeCommandProvider;
