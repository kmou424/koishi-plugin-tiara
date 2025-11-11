import { Session } from "koishi";
import { Result } from "../../core/type";
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

  public static async createUser(
    session: Session,
    acl: User.ACLs
  ): Promise<Result<User.Schema>> {
    const { platform, userId } = session;
    const platformUser = await PlatformUserQueries.findOne(platform, userId);
    if (platformUser) {
      const user = await UserQueries.findOne(platformUser.id);
      if (user) {
        return Result(user, new Error("user already exists"));
      }
      return Result(user, null);
    }

    const createdPlatformUser = await PlatformUserQueries.create({
      id: 0,
      platform,
      userId,
    });
    if (!createdPlatformUser) {
      return Result(null, new Error("failed to create platform user"));
    }

    const createdUser = await UserQueries.create({
      uid: 0,
      bindId: createdPlatformUser.id,
      acl,
    });
    if (!createdUser) {
      return Result(null, new Error("failed to create user"));
    }

    return Result(createdUser, null);
  }
}
