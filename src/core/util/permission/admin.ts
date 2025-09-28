import { Session } from "koishi";
import { PluginContext, Roles } from "../../../core/type";

export function IsAdmin(session: Session, roles: Roles): boolean {
  return roles.some(
    (role) => role.platform === session.platform && role.id === session.userId
  );
}

export function AdminContext(ctx: PluginContext) {
  return ctx().intersect((session) => {
    return this.IsAdmin(session, ctx.cfg.admins);
  });
}
