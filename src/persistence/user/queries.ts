import Global from "../../core/global";
import { User } from "./schema";

export class UserQueries {
  public static async findOne(uid: number): Promise<User.Schema | null> {
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
      return null;
    }
    return user[0];
  }
}
