import { Context } from "koishi";
import { SchemaRegistry } from "./core/schema";

import "./libs/property";
import "./libs/revoke";

export default function migrate(ctx: Context): void {
  SchemaRegistry.migrate(ctx);
}
