import { Field, FlatKeys, Model, Types } from "koishi";
import { PluginName } from "../../consts";

declare module "koishi" {
  interface Tables {
    [RevokeListener.TableName]: RevokeListener.Schema;
  }
}

export namespace RevokeListener {
  export const TableName = `${PluginName}.revoke.listener`;

  export type Schema = {
    platform: string;
    userId: string;
  };

  export const Schema: Field.Extension<Schema, Types> = {
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
    primary: ["platform", "userId"],
    unique: ["platform", "userId"],
    indexes: ["platform", "userId"],
    foreign: {},
    autoInc: false,
  };
}
