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
} from "../../../../packages/persistence/revoke";
import { RevokeUtil } from "../../../../packages/util/permission";

class RevokeHandlerProvider extends HandlerProvider {
  Provide(ctx: PluginContext): void {
    ctx
      .createFilter()
      .when((session: Session) => RevokeUtil.IsListener(ctx, session))
      .then(async (ctx: PluginContext) => {
        ctx()
          .platform(...MsgPlatform.asKoishi(MsgPlatform.QQ))
          .on("message", this.QQCacheMsgHandler(ctx));
        ctx().on("message-deleted", this.MessageDeletedHandler(ctx));
      });
  }

  private QQCacheMsgHandler: MessageHandlerFunc = (
    ctx: PluginContext
  ): MessageListener => {
    // QQ 的可撤回时间是两分钟
    const TTL = 60 * 2;
    return async (session: Session) => {
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
      const operatorId = session.event.operator?.id;
      if (operatorId === session.selfId) {
        return;
      }

      const userId = session.event.user?.id;
      // 只监听本人撤回的消息
      if (userId !== operatorId) {
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

        const cacheMessage = await RevocableMessageCache.load(cacheKey);
        if (!cacheMessage) {
          return;
        }

        RevocableMessageCache.delete(cacheKey);

        await session.send(
          <>
            <at id={operatorId} /> 撤回了一条消息:
          </>
        );
        await session.send(cacheMessage.message);
      }
    };
  };
}

export default RevokeHandlerProvider;
