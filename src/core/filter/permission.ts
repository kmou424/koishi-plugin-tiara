import { Session } from "koishi";
import { FilterFunc, PluginContext } from "../type";

export function mustAdmin(ctx: PluginContext): FilterFunc {
  return async (session: Session) => {
    const roles = ctx.cfg.admins;
    return roles.some(
      (role) => role.platform === session.platform && role.id === session.userId
    );
  };
}
