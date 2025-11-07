import { Context } from "koishi";
import { SchemaRegistry } from "./core/schema";

import "./persistence/platform-user";
import "./persistence/property";
import "./persistence/revoke";
import "./persistence/user";

export default function migrate(ctx: Context): void {
  SchemaRegistry.migrate(ctx);
}
