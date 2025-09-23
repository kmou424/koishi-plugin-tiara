import { Session } from "koishi";
import { PluginContext, Roles } from "../../../core/type";

class Admin {
  public static IsAdmin(session: Session, roles: Roles): boolean {
    return roles.some(
      (role) => role.platform === session.platform && role.id === session.userId
    );
  }

  public static AdminContext(ctx: PluginContext) {
    return ctx().intersect((session) => {
      return this.IsAdmin(session, ctx.cfg.admins);
    });
  }
}

export default Admin;
