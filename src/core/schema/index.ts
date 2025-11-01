import { Context, Field, FlatKeys, Model, Types } from "koishi";

export interface SchemaDefinition<T = any> {
  tableName: string;
  schema: Field.Extension<T, Types>;
  config: Model.Config<FlatKeys<T, unknown>>;
}

export class SchemaRegistry {
  private static schemas: SchemaDefinition[] = [];

  public static register<T>(definition: SchemaDefinition<T>): void {
    this.schemas.push(definition);
  }

  public static migrate(ctx: Context): void {
    this.schemas.forEach(({ tableName, schema, config }) => {
      ctx.model.extend(tableName as any, schema, config);
    });
  }

  public static getAll(): ReadonlyArray<SchemaDefinition> {
    return this.schemas;
  }
}
