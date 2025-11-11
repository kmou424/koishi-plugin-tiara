import { Property } from "../persistence/property";

export class UserProperties {
  public static AutoIncUid = new Property("user.auto_inc_uid").number(100000);
}
