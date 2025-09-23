import { Command } from "koishi";
import { TiaraCommand } from ".";
import { CoreUtil } from "../../../../core";
import {
  CommandHandlerFunc,
  CommandHandlerInput,
  HandlerProvider,
  PluginContext,
} from "../../../../core/type";
import Properties from "../../../../properties";

const TiaraPropertyCommand = "prop";

class PropertyHandlerProvider extends HandlerProvider {
  Provide(ctx: PluginContext): void {
    CoreUtil.Permission.AdminContext(ctx)
      .command(`${TiaraCommand}.${TiaraPropertyCommand}`, "Tiara 配置")
      .option("write", "-w <key:string> <value:string> 写入", {
        type: "boolean",
        fallback: false,
      })
      .option("read", "-r <key:string> 读取", {
        type: "boolean",
        fallback: false,
      })
      .option("list", "-l 列表", {
        type: "boolean",
        fallback: false,
      })
      .action(this.PropertyCommandHandler(ctx));
  }

  private PropertyCommandHandler: CommandHandlerFunc = (
    ctx: PluginContext
  ): Command.Action => {
    interface Option {
      write: boolean;
      read: boolean;
      list: boolean;
    }

    const Write = async (
      input: CommandHandlerInput,
      key: string,
      value: string
    ): Promise<void> => {
      if (!Properties[key]) {
        await input.session.send(`键 "${key}" 不存在`);
        return;
      }
      await Properties[key].set(value);
      await input.session.send(`${key} = ${await Properties[key].get()}`);
    };

    const Read = async (
      input: CommandHandlerInput,
      key: string
    ): Promise<void> => {
      if (!Properties[key]) {
        await input.session.send(`键 "${key}" 不存在`);
        return;
      }
      await input.session.send(`${key} = ${await Properties[key].get()}`);
    };

    return async (input: CommandHandlerInput, key: string, value: string) => {
      const { write, read, list } = input.options as unknown as Option;
      if ([write, read, list].filter((val) => val).length > 1) {
        await input.session.send("请勿同时使用 -w -r -l 选项");
        return;
      }
      switch (true) {
        case write:
          return await Write(input, key, value);
        case read:
          return await Read(input, key);
      }
    };
  };
}

export default PropertyHandlerProvider;
