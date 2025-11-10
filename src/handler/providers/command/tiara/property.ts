import { Command } from "koishi";
import {
  CommandHandlerFunc,
  CommandHandlerInput,
  HandlerProvider,
  PluginContext,
} from "../../../../core/type";
import Properties from "../../../../properties";
import { TiaraCommand, TiaraPropertyCommand } from "./consts";

class PropertyHandlerProvider extends HandlerProvider {
  Provide(ctx: PluginContext): void {
    ctx().command(`${TiaraCommand}.${TiaraPropertyCommand}`, "Tiara 配置");
    ctx()
      .command(`${TiaraCommand}.${TiaraPropertyCommand}.list`, "Tiara 配置列表")
      .action(this.PropertyListCommandHandler(ctx));
    ctx()
      .command(
        `${TiaraCommand}.${TiaraPropertyCommand}.get <key:string>`,
        "Tiara 配置读取"
      )
      .action(this.PropertyGetCommandHandler(ctx));
    ctx()
      .command(
        `${TiaraCommand}.${TiaraPropertyCommand}.set <key:string> <value:string>`,
        "Tiara 配置写入"
      )
      .action(this.PropertySetCommandHandler(ctx));
  }

  private PropertyListCommandHandler: CommandHandlerFunc = (
    ctx: PluginContext
  ): Command.Action => {
    return async (input: CommandHandlerInput) => {
      await input.session.send(Object.keys(Properties).join(", "));
    };
  };

  private PropertyGetCommandHandler: CommandHandlerFunc = (
    ctx: PluginContext
  ): Command.Action => {
    return async (input: CommandHandlerInput, key: string) => {
      if (!Properties[key]) {
        await input.session.send(`键 "${key}" 不存在`);
        return;
      }
      await input.session.send(`${key} = ${await Properties[key].getAsync()}`);
    };
  };

  private PropertySetCommandHandler: CommandHandlerFunc = (
    ctx: PluginContext
  ): Command.Action => {
    return async (input: CommandHandlerInput, key: string, value: string) => {
      if (!Properties[key]) {
        await input.session.send(`键 "${key}" 不存在`);
        return;
      }
      await Properties[key].set(value);
      await input.session.send(`${key} = ${await Properties[key].getAsync()}`);
    };
  };
}

export default PropertyHandlerProvider;
