import { Tables } from "koishi";
import Global from "../core/global";
import { IRepository } from "../core/orm/type";
import { PluginContext } from "../core/type";
import * as Property from "../libs/property";

export interface RepositoryProvider {
  initialize(ctx: PluginContext): Promise<void>;
  dispose(ctx: PluginContext): void;
}

export function GetPropertyRepository(): IRepository<
  Tables[typeof Property.TableName]
> {
  const repo = Global.ORM.getRepository(Property.TableName as any) as
    | IRepository<Tables[typeof Property.TableName]>
    | undefined;
  if (!repo) {
    throw new Error("PropertyRepository not initialized");
  }
  return repo;
}

export const PropertyRepositoryProvider: RepositoryProvider = {
  async initialize(ctx: PluginContext): Promise<void> {
    // 数据库迁移
    ctx().model.extend(
      Property.TableName,
      Property.Schema,
      Property.SchemaConfig
    );

    // 通过 Global.ORM 创建仓库并显式初始化（不保留本地状态）
    const repository = Global.ORM.createRepository({
      tableName: Property.TableName,
      modelConfig: Property.SchemaConfig,
    });
    await repository.initialize();
  },

  dispose(ctx: PluginContext): void {
    return;
  },
};
