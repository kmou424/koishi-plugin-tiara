import { Schema } from "koishi";

export interface Role {
  platform: string;
  id: string;
}

export const Role: Schema<Role> = Schema.object({
  platform: Schema.string().description("平台").required(),
  id: Schema.string().description("ID").required(),
});

export type Roles = Role[];

export type AdminConfig = Roles;

export const AdminConfig: Schema<AdminConfig> =
  Schema.array(Role).description("管理员");
