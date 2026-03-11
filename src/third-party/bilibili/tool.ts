import axios from "axios";

const exclude_params = new Set([]);

class BilibiliTool {
  static async parseB23url(url: string) {
    const resp = await axios.get(url);
    const redirect_url = new URL(resp.request.res.responseUrl);
    this.clean_url(redirect_url);
    return redirect_url.toString();
  }

  static clean_url(url: URL) {
    const params_keys = Array.from(url.searchParams.keys());
    params_keys.forEach((key) => {
      if (!exclude_params.has(key)) {
        url.searchParams.delete(key);
      }
    });
    if (url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }
  }

  static getBVFromUrl(url: string) {
    // https://www.bilibili.com/video/BV1Qy4y1L76y
    const match = url.match(/BV\w+/);
    return match ? match[0] : null;
  }

  static async getAidFromUrl(url: string) {
    const api_url = `https://api.bilibili.com/x/web-interface/view?bvid=${this.getBVFromUrl(url)}`;
    const resp = await axios.get(api_url);
    return resp.data.data.aid;
  }
}

export { BilibiliTool };
