import { Context } from "koishi";

import * as Property from "./libs/property";

function migrate(ctx: Context) {
  ctx.model.extend(Property.TableName, Property.Schema, Property.SchemaConfig);
}

export default migrate;
