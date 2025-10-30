import { Session } from "koishi";
import { GetRevokeListenerRepository } from "../../../repositories";
import { PluginContext } from "../../type";

class Revoke {
  public static IsListener(ctx: PluginContext, session: Session): boolean {
    const records = GetRevokeListenerRepository().get(
      {
        platform: session.platform,
        userId: session.userId,
      },
      {
        limit: 1,
      }
    );
    return records.length > 0;
  }
}

export default Revoke;
