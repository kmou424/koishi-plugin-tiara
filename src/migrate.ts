import { Context } from "koishi";
import { SchemaRegistry } from "./core/schema";

import "./libs/platform-user";
import "./libs/property";
import "./libs/revoke";
import "./libs/user";

export default function migrate(ctx: Context): void {
  SchemaRegistry.migrate(ctx);
}
