import { Session } from "koishi";
import { Result } from "../../core/type";
import {
  PlatformUser,
  PlatformUserQueries,
} from "../persistence/platform-user";
import { UserQueries } from "../persistence/user";
import { User } from "../persistence/user/schema";

export class UserFn {
  public static async findBindUser(
    session: Session
  ): Promise<Result<User.Schema>> {
    const { platformUser, err } = await PlatformUserQueries.findOne(
      session.platform,
      session.userId
    );
    if (err) {
      return Result(null, err);
    }
    return await UserQueries.findOne(platformUser.id);
  }

  public static async createUser(
    session: Session,
    acl: User.ACLs
  ): Promise<Result<User.Schema>> {
    const { platform, userId } = session;
    let err: Error | null = null;
    let platformUser: PlatformUser.Schema | null = null;

    ({ platformUser, err } = await PlatformUserQueries.findOne(
      platform,
      userId
    ));
    if (!err) {
      if ((await UserQueries.findOne(platformUser.id)).isOk()) {
        return Result(null, new Error("user already exists"));
      }
    } else {
      ({ platformUser, err } = await PlatformUserQueries.create({
        platform,
        userId,
      }));
      if (err) {
        return Result(
          null,
          new Error(`failed to create platform user: ${err.message}`)
        );
      }
    }

    let user: User.Schema | null = null;
    ({ user, err } = await UserQueries.create({
      bindId: platformUser.id,
      acl,
    }));
    if (err) {
      return Result(null, new Error(`failed to create user: ${err.message}`));
    }

    return Result(user, null);
  }
}
