class BilibiliVideo {
  bvid: string;
  title: string;
  desc: string;
  duration: number;
  pic: string;
  owner: BilibiliVideoOwner;
  stat: {
    view: number;
    danmaku: number;
    reply: number;
    favorite: number;
    coin: number;
    share: number;
    like: number;
    dislike: number;
  };
}

class BilibiliVideoOwner {
  mid: string;
  name: string;
  face: string;
}

export { BilibiliVideo, BilibiliVideoOwner };
