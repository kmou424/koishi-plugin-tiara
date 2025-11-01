import { Field, FlatKeys, Model, Types } from "koishi";
import { PluginName } from "../../consts";
import { SchemaRegistry } from "../../core/schema";

declare module "koishi" {
  interface Tables {
    [RevokeListener.TableName]: RevokeListener.Schema;
  }
}

export namespace RevokeListener {
  export const TableName = `${PluginName}.revoke.listener`;

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
  tableName: RevokeListener.TableName,
  schema: RevokeListener.Schema,
  config: RevokeListener.SchemaConfig,
});
