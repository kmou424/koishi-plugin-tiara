import { Session } from "koishi";
import { FilterFunc, PluginContext } from "../../core/type";
import { RevokeListener } from "../persistence/revoke";

export class PermissionFilter {
  public static mustAdmin(ctx: PluginContext): FilterFunc {
    return async (session: Session) => {
      const roles = ctx.cfg.admins;
      return roles.some(
        (role) =>
          role.platform === session.platform && role.id === session.userId
      );
    };
  }
}

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
