import axios, { AxiosInstance } from "axios";
import { BilibiliVideo } from "./type";

class BilibiliAPI {
  private static readonly client: AxiosInstance = axios.create();

  static async get_video_info(bv: string): Promise<BilibiliVideo> {
    const url = `https://api.bilibili.com/x/web-interface/view?bvid=${bv}`;
    const video = (await this.client.get(url)).data.data as BilibiliVideo;
    return video;
  }
}

export { BilibiliAPI };
