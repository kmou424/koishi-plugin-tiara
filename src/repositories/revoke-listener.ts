import { Tables } from "koishi";
import Global from "../core/global";
import { IRepository } from "../core/orm/type";
import { PluginContext } from "../core/type";
import { RevokeListener } from "../libs/revoke";
import { RepositoryProvider } from "./type";

export function GetRevokeListenerRepository(): IRepository<
  Tables[typeof RevokeListener.TableName]
> {
  const repo = Global.ORM.getRepository(RevokeListener.TableName as any) as
    | IRepository<Tables[typeof RevokeListener.TableName]>
    | undefined;
  if (!repo) {
    throw new Error("RevokeListenerRepository not initialized");
  }
  return repo;
}

export const RevokeListenerRepositoryProvider: RepositoryProvider = {
  async initialize(ctx: PluginContext): Promise<void> {
    // 数据库迁移
    ctx().model.extend(
      RevokeListener.TableName,
      RevokeListener.Schema,
      RevokeListener.SchemaConfig
    );

    // 通过 Global.ORM 创建仓库并显式初始化（不保留本地状态）
    const repository = Global.ORM.createRepository({
      tableName: RevokeListener.TableName,
      modelConfig: RevokeListener.SchemaConfig,
    });
    await repository.initialize();
  },

  dispose(ctx: PluginContext): void {
    return;
  },
};
