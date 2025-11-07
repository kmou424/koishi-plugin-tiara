import { Session } from "koishi";
import { FilterFunc, PluginContext } from "../core/type";

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
