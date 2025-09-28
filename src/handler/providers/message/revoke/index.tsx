import { Element, Next, Session } from "koishi";
import {
  HandlerProvider,
  MessageHandlerFunc,
  MessageListener,
  MsgPlatform,
  PluginContext,
} from "../../../../core/type";
import {
  createCacheKey,
  createCacheMessage,
  RevocableMessageCache,
} from "../../../../libs/revoke";
import { CoreUtil } from "../../../../core";

class RevokeHandlerProvider extends HandlerProvider {
  Provide(ctx: PluginContext): void {
    ctx()
      .platform(...MsgPlatform.asKoishi(MsgPlatform.QQ))
      .on("message", this.QQCacheMsgHandler(ctx));
    ctx().on("message-deleted", this.MessageDeletedHandler(ctx));
  }

  private QQCacheMsgHandler: MessageHandlerFunc = (
    ctx: PluginContext
  ): MessageListener => {
    // QQ 的可撤回时间是两分钟
    const TTL = 60 * 2;
    return async (session: Session) => {
      if (!(await CoreUtil.Permission.Revoke.IsListener(ctx, session))) {
        return;
      }

      const cacheKey = createCacheKey(
        session.platform,
        session.selfId,
        session.channelId,
        session.messageId
      );
      const cacheMessage = createCacheMessage(session.elements, Date.now());
      RevocableMessageCache.add(cacheKey, cacheMessage, TTL);
    };
  };

  private MessageDeletedHandler: MessageHandlerFunc = (
    ctx: PluginContext
  ): MessageListener => {
    return async (session: Session) => {
      if (!(await CoreUtil.Permission.Revoke.IsListener(ctx, session))) {
        return;
      }

      const operatorId = session.event.operator?.id;
      if (operatorId === session.selfId) {
        return;
      }

      const messageId = session.event.message?.id;
      if (messageId) {
        const cacheKey = createCacheKey(
          session.platform,
          session.selfId,
          session.channelId,
          messageId
        );

        const elements: Element[] = [];
        if (operatorId) {
          elements.push(
            <>
              <at id={operatorId} /> 撤回了一条消息:
            </>
          );
          elements.push(<br />);
        }

        const cacheMessage = await RevocableMessageCache.load(cacheKey);
        if (!cacheMessage) {
          return;
        }
        elements.push(...cacheMessage.message);

        RevocableMessageCache.delete(cacheKey);

        await session.send(elements);
      }
    };
  };
}

export default RevokeHandlerProvider;
