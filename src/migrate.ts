import { Context } from "koishi";
import { SchemaRegistry } from "./core/schema";

import "./packages/persistence/platform-user";
import "./packages/persistence/property";
import "./packages/persistence/revoke";
import "./packages/persistence/user";

export default function migrate(ctx: Context): void {
  SchemaRegistry.migrate(ctx);
}
