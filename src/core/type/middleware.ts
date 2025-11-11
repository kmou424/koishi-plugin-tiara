import { Fragment, Next, Session } from "koishi";

export type MiddlewareFunc = (
  session: Session,
  next: Next
) => Promise<void | Fragment>;
