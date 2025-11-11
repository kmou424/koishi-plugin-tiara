import Global from "../../../core/global";
import { PlatformUser } from "./schema";

export class PlatformUserQueries {
  public static async findOne(
    platform: string,
    platformUserId: string
  ): Promise<PlatformUser.Schema | null> {
    const platformUser = await Global.Context().model.get(
      PlatformUser.TableName,
      {
        platform,
        userId: platformUserId,
      },
      {
        limit: 1,
        sort: {
          id: "asc",
        },
      }
    );
    if (platformUser.length === 0) {
      return null;
    }
    return platformUser[0];
  }

  public static async create(
    platformUser: PlatformUser.Schema
  ): Promise<PlatformUser.Schema> {
    delete platformUser.id;
    const inserted = await Global.Context().model.create(
      PlatformUser.TableName,
      platformUser
    );
    if (inserted) {
      return platformUser;
    }
    return null;
  }
}
