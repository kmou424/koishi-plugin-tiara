import { Field, FlatKeys, Model, Types } from "koishi";
import { PluginName } from "../../consts";
import { SchemaRegistry } from "../../core/schema";

declare module "koishi" {
  interface Tables {
    [PlatformUser.TableName]: PlatformUser.Schema;
  }
}

export namespace PlatformUser {
  export const TableName = `${PluginName}.platform.user`;

  export type Schema = {
    id: number;
    platform: string;
    userId: string;
  };

  export const Schema: Field.Extension<Schema, Types> = {
    id: {
      type: "integer",
      nullable: false,
    },
    platform: {
      type: "string",
      nullable: false,
    },
    userId: {
      type: "string",
      nullable: false,
    },
  };

  export const SchemaConfig: Model.Config<FlatKeys<Schema, unknown>> = {
    primary: ["id"],
    unique: [["platform", "userId"]],
    indexes: [["platform", "userId"]],
    foreign: {},
    autoInc: true,
  };
}

SchemaRegistry.register({
  tableName: PlatformUser.TableName,
  schema: PlatformUser.Schema,
  config: PlatformUser.SchemaConfig,
});
