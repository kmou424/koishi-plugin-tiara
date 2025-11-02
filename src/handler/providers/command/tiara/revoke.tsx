import { Command, h } from "koishi";
import {
  CommandHandlerFunc,
  CommandHandlerInput,
  HandlerProvider,
  PluginContext,
} from "../../../../core/type";
import { RevokeListener } from "../../../../libs/revoke";
import { TiaraCommand, TiaraRevokeCommand } from "./consts";
import { CoreFilters } from "../../../../core";

class RevokeCommandProvider extends HandlerProvider {
  Provide(ctx: PluginContext): void {
    ctx
      .createFilter()
      .when(CoreFilters.mustAdmin(ctx))
      .then(this.registerCommands);
  }

  private async registerCommands(ctx: PluginContext) {
    ctx().command(`${TiaraCommand}.${TiaraRevokeCommand}`, "撤回事件管理器");
    ctx()
      .command(
        `${TiaraCommand}.${TiaraRevokeCommand}.listen <atMessage:string>`,
        "监听并补档用户撤回消息"
      )
      .action(this.RevokeListenCommandHandler(ctx));
    ctx()
      .command(
        `${TiaraCommand}.${TiaraRevokeCommand}.unlisten <atMessage:string>`,
        "停止监听并补档用户撤回消息"
      )
      .action(this.RevokeUnlistenCommandHandler(ctx));
  }

  private async ListenerExists(
    ctx: PluginContext,
    platform: string,
    userId: string
  ): Promise<boolean> {
    return (
      (
        await ctx().database.get(
          RevokeListener.TableName,
          {
            platform,
            userId,
          },
          { limit: 1 }
        )
      ).length > 0
    );
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

      if (
        await this.ListenerExists(ctx, input.session.platform, message.attrs.id)
      ) {
        await input.session.send("禁止重复监听");
        return;
      }

      await ctx().database.create(RevokeListener.TableName, {
        platform: input.session.platform,
        userId: message.attrs.id,
      });
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

      if (
        !(await this.ListenerExists(
          ctx,
          input.session.platform,
          message.attrs.id
        ))
      ) {
        await input.session.send("未监听该用户");
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
