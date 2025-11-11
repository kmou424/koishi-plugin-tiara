import Global from "../../../core/global";
import { Result } from "../../../core/type";
import { RuntimeUtil } from "../../util/runtime";
import { PlatformUser } from "./schema";

export class PlatformUserQueries {
  public static async findOne(
    platform: string,
    platformUserId: string
  ): Promise<Result<PlatformUser.Schema>> {
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
      return Result(null, RuntimeUtil.NotFound);
    }
    return Result(platformUser[0], null);
  }

  public static async create(
    platformUser: Omit<PlatformUser.Schema, "id">
  ): Promise<Result<PlatformUser.Schema>> {
    const inserted = await Global.Context().model.create(
      PlatformUser.TableName,
      platformUser
    );
    if (inserted) {
      return Result(inserted, null);
    }
    return Result(null, new Error("failed to create platform user"));
  }
}
