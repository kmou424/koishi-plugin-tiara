import { Context } from "koishi";

import * as Property from "./libs/property";
import { RevokeListener } from "./libs/revoke";

function migrate(ctx: Context) {
  ctx.model.extend(Property.TableName, Property.Schema, Property.SchemaConfig);
  ctx.model.extend(
    RevokeListener.TableName,
    RevokeListener.Schema,
    RevokeListener.SchemaConfig
  );
}

export default migrate;
