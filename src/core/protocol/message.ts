import { Guild, GuildMember } from "@satorijs/protocol";
import TTLCache from "@tiara/core/cache/ttl_cache";
import { MsgContent, MsgPlatform, MsgType } from "@tiara/core/type";
import { Session } from "koishi";
import { MemberRole } from "./member";

const parseMsgPlatform = (platform: string | null): MsgPlatform => {
  switch (platform) {
    case "onebot":
      return MsgPlatform.QQ;
    case "telegram":
      return MsgPlatform.Telegram;
    default:
      return MsgPlatform.Unknown;
  }
};

const parseMsgType = (type: string): MsgType => {
  if (Object.values(MsgType).includes(type as MsgType)) {
    return type as MsgType;
  }
  return MsgType.Unknown;
};

const parseMsgContent = (message: Array<Object> | null): Array<MsgContent> => {
  return message.map((item) => {
    return {
      type: parseMsgType(item["type"]),
      data: item["data"]?.["data"] ? JSON.parse(item["data"]?.["data"]) : "{}",
    };
  });
};

const parseMemberRole = (role: string): MemberRole => {
  switch (role) {
    case "owner":
      return MemberRole.Owner;
    case "admin":
      return MemberRole.Admin;
    case "member":
      return MemberRole.Member;
    default:
      return MemberRole.Member;
  }
};

export class Message {
  session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  get platform(): MsgPlatform {
    return parseMsgPlatform(this.session.event._type);
  }

  get content(): Array<MsgContent> {
    return parseMsgContent(this.session.event._data?.message);
  }

  get isGroup(): boolean {
    return this.session.event.guild !== null;
  }

  get guild(): Guild {
    return this.session.event.guild;
  }

  members = new TTLCache<Array<GuildMember>>(null, 60, async () => {
    const members = await this.session.bot.getGuildMemberList(this.guild.id);
    return members.data;
  });

  async canDelete(): Promise<boolean> {
    if (this.isGroup) {
      // 群聊 [群主] 可以撤回所有消息
      // 群聊 [管理员] 可以撤回普通成员的消息

      // 获取机器人用户角色
      const myRole: MemberRole = Math.max(
        ...((await this.members.get())
          ?.find((member) => member.user?.id === this.session.event.selfId)
          ?.roles?.map((role) => parseMemberRole(role)) || [])
      ) as MemberRole;

      // 是管理员或群主
      if (myRole >= MemberRole.Admin) {
        // 判断目标身份
        const targetRole: MemberRole = Math.max(
          ...(this.session.event?.member?.roles?.map((role) =>
            parseMemberRole(role)
          ) || [])
        ) as MemberRole;

        if (targetRole < MemberRole.Owner && myRole == MemberRole.Owner) {
          // 群主可以撤回管理员和普通成员的消息
          return true;
        }
        if (targetRole < MemberRole.Admin && myRole == MemberRole.Admin) {
          // 管理员可以撤回普通成员的消息
          return true;
        }
        return false;
      }
    }

    // 群聊 [普通成员] 只能撤回自己的消息，且消息时间在 2 分钟内
    // 私聊 [无身份差别] 只能撤回自己的消息，且消息时间在 2 分钟内
    if (
      this.session.event.member.user?.id === this.session.event.selfId &&
      this.session.event.timestamp - this.session.event.message.timestamp <
        120000
    ) {
      return true;
    }
    return false;
  }

  async deleteMsg(): Promise<void> {
    if (await this.canDelete()) {
      await this.session.bot.deleteMessage(
        this.session.channelId,
        this.session.messageId
      );
    }
  }
}
