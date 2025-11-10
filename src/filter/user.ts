import { Session } from "koishi";
import Global from "../core/global";
import { FilterFunc } from "../core/type";
import { PlatformUser } from "../persistence/platform-user";
import { User } from "../persistence/user";

export class UserFilter {
  public static mustRegister(): FilterFunc {
    return async (session: Session) => {
      const platformUser = await Global.Context().model.get(
        PlatformUser.TableName,
        {
          platform: session.platform,
          userId: session.userId,
        },
        {
          limit: 1,
        }
      );
      if (platformUser.length === 0) {
        return false;
      }

      const user = await Global.Context().model.get(
        User.TableName,
        {
          bindId: platformUser[0].id,
        },
        {
          limit: 1,
        }
      );
      if (user.length === 0) {
        return false;
      }

      return true;
    };
  }
}
