import Global from "../../../core/global";
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

  public static async create(user: User.Schema): Promise<User.Schema> {
    delete user.uid;
    const inserted = await Global.Context().model.create(User.TableName, user);
    if (inserted) {
      return user;
    }
    return null;
  }
}
