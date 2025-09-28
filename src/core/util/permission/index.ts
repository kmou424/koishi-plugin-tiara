import { AdminContext, IsAdmin } from "./admin";
import Revoke from "./revoke";

export class Permission {
  public static IsAdmin = IsAdmin;
  public static AdminContext = AdminContext;
  public static Revoke = Revoke;
}
