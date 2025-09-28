import { Field, FlatKeys, Model, Types } from "koishi";
import { PluginName } from "../../consts";

declare module "koishi" {
  interface Tables {
    [TableName]: Schema;
  }
}

export const TableName = `${PluginName}.property`;

export type Schema = {
  key: string;
  value: string;
};

export const Schema: Field.Extension<Schema, Types> = {
  key: {
    type: "string",
    nullable: false,
  },
  value: {
    type: "string",
  },
};

export const SchemaConfig: Model.Config<FlatKeys<Schema, unknown>> = {
  primary: "key",
  unique: ["key"],
  indexes: ["key"],
  foreign: {},
  autoInc: false,
};
