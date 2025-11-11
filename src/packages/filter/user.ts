import { Session } from "koishi";
import Global from "../../core/global";
import { FilterFunc } from "../../core/type";
import { UserQueries } from "../persistence/user";

export class UserFilter {
  public static isRegistered(yes: boolean): FilterFunc {
    return async (session: Session) => {
      const uid = Global.Context.uid;
      if (!uid) {
        return !yes;
      }
      const user = await UserQueries.findOne(uid);
      if (!user) {
        return !yes;
      }
      return yes;
    };
  }
}
