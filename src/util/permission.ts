import { Session } from "koishi";
import { PluginContext } from "../core/type";
import { RevokeListener } from "../persistence/revoke";

export class RevokeUtil {
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
