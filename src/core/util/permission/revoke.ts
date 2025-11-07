import { Session } from "koishi";
import { RevokeListener } from "../../../libs/revoke";
import { PluginContext } from "../../type";

class Revoke {
  public static async IsListener(
    ctx: PluginContext,
    session: Session
  ): Promise<boolean> {
    const records = await ctx().database.get(
      RevokeListener.TableName,
      {
        platform: session.platform,
        userId: session.userId,
      },
      {
        limit: 1,
      }
    );
    return records.length > 0;
  }
}

export default Revoke;
