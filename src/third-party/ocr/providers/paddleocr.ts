import axios from "axios";
import { Schema } from "koishi";
import { PrecheckFunc, PredictFunc } from "../type";

export namespace PaddleOCR {
  export const Enabled = true;
  export interface Config {
    engine: "paddleocr";
    endpoint: string;
  }

  export const Config: Schema<Config> = Schema.object({
    engine: Schema.const("paddleocr"),
    endpoint: Schema.string().description("PaddleOCR 的 API 地址").default(""),
  }).description("PaddleOCR 配置");

  export const Predict: PredictFunc = async (ctx, options) => {
    const { type, data } = options;
    const config = options.config as Config;
    const url = new URL(config.endpoint);
    url.pathname = "/ocr/predict";

    const body: {
      type: string;
      data: string;
    } = {
      type: type,
      data: data,
    };

    try {
      const resp = await axios.post(url.toString(), body, {
        timeout: 30 * 1000,
      });
      return (resp.data.data[0] as object[][])
        .map((item) => item[1][0])
        .join("");
    } catch (error) {
      ctx.logger.error("OCR predict error:", error);
      return "";
    }
  };

  export const Precheck: PrecheckFunc = async (ctx) => {
    const config = ctx.cfg as Config;
    const url = new URL(config.endpoint);
    url.pathname = "/ocr/health";
    try {
      const resp = await axios.get(url.toString(), {
        timeout: 5000,
      });
      return resp.status === 200;
    } catch (error) {
      ctx.logger.error("OCR precheck error:", error);
      return false;
    }
  };
}
