import Global from "../../../core/global";
import { Result } from "../../../core/type";
import { RuntimeUtil } from "../../util/runtime";
import { User } from "./schema";

export class UserQueries {
  public static async findOne(uid: number): Promise<Result<User.Schema>> {
    const user = await Global.Context().model.get(
      User.TableName,
      {
        uid,
      },
      {
        limit: 1,
        sort: {
          uid: "asc",
        },
      }
    );
    if (user.length === 0) {
      return Result(null, RuntimeUtil.NotFound);
    }
    return Result(user[0], null);
  }

  public static async create(user: User.Schema): Promise<Result<User.Schema>> {
    const inserted = await Global.Context().model.create(User.TableName, user);
    if (inserted) {
      return Result(inserted, null);
    }
    return Result(null, new Error("failed to create user"));
  }
}
