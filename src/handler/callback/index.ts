import { Session } from "koishi";
import { make_message } from "../../core/protocol";
import { MessageRegistry } from "../registry";

const message_callback = (session: Session) => {
  const msg = make_message(session);
  for (const handler of MessageRegistry) {
    if (handler.AccpetChannel !== msg.channel) {
      continue;
    }
    handler.handle(msg);
  }
};

export { message_callback };
