import { Field, FlatKeys, Model, Types } from "koishi";
import { PluginName } from "../../../consts";
import { SchemaRegistry } from "../../../core/schema";
import { PlatformUser } from "../platform-user";

declare module "koishi" {
  interface Tables {
    [User.TableName]: User.Schema;
  }
}

export namespace User {
  export const TableName = `${PluginName}.user`;

  export enum ACLs {
    Guest = 0,
    User = 1,
    Admin = 999,
  }

  export type Schema = {
    uid: number;
    bindId: number;
    acl: ACLs;
  };

  export const Schema: Field.Extension<Schema, Types> = {
    uid: {
      type: "integer",
      nullable: false,
      initial: 100001,
    },
    bindId: {
      type: "integer",
      nullable: false,
    },
    acl: {
      type: "integer",
      nullable: false,
      initial: ACLs.Guest,
    },
  };

  export const SchemaConfig: Model.Config<FlatKeys<Schema, unknown>> = {
    primary: ["uid"],
    unique: [["bindId"]],
    indexes: [["bindId"]],
    foreign: {
      bindId: [PlatformUser.TableName, "id"],
    },
    autoInc: true,
  };
}

SchemaRegistry.register({
  tableName: User.TableName,
  schema: User.Schema,
  config: User.SchemaConfig,
});
