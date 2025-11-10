import { Session } from "koishi";
import { PlatformUserQueries } from "../persistence/platform-user";
import { UserQueries } from "../persistence/user";
import { User } from "../persistence/user/schema";

export class UserFn {
  public static async findBindUser(
    session: Session
  ): Promise<User.Schema | null> {
    const platformUser = await PlatformUserQueries.findOne(
      session.platform,
      session.userId
    );
    if (!platformUser) {
      return null;
    }
    return UserQueries.findOne(platformUser.id);
  }
}
