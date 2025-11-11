import { Session } from "koishi";
import { Result } from "../../core/type";
import {
  PlatformUser,
  PlatformUserQueries,
} from "../persistence/platform-user";
import { UserQueries } from "../persistence/user";
import { User } from "../persistence/user/schema";
import { UserProperties } from "../properties/user";
import { RuntimeUtil } from "../util/runtime";

export class UserFn {
  public static async findBindUser(
    session: Session
  ): Promise<Result<User.Schema>> {
    const { platformUser, err } = await PlatformUserQueries.findOne(
      session.platform,
      session.userId
    );
    if (err && err !== RuntimeUtil.NotFound) {
      return Result(null, err);
    }
    if (!platformUser) {
      return Result(null, RuntimeUtil.NotFound);
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
    if (err && err !== RuntimeUtil.NotFound) {
      return Result(null, err);
    }
    if (platformUser) {
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

    return await UserProperties.AutoIncUid.mutex()
      .acquire()
      .then(async (release): Promise<Result<User.Schema>> => {
        const uid = (await UserProperties.AutoIncUid.getAsync()) + 1;

        let user: User.Schema | null = null;
        ({ user, err } = await UserQueries.create({
          uid: uid,
          bindId: platformUser.id,
          acl,
        }));

        if (err) {
          release();
          return Result(
            null,
            new Error(`failed to create user: ${err.message}`)
          );
        }
        await UserProperties.AutoIncUid.setAsync(uid);

        release();
        return Result(user, null);
      });
  }
}
