import axios from "axios";
import { Schema } from "koishi";
import { PluginContext } from "../../../core/type";
import { OCRProvider, PredictOptions } from "../type";

export interface PaddleOCRConfig {
  engine: "paddleocr";
  endpoint: string;
}

export const PaddleOCRConfig: Schema<PaddleOCRConfig> = Schema.object({
  engine: Schema.const("paddleocr"),
  endpoint: Schema.string()
    .description("PaddleOCR 的 API 地址")
    .default("")
    .required(),
});

export class PaddleOCRProvider extends OCRProvider {
  enabled = true;

  async predict(ctx: PluginContext, options: PredictOptions): Promise<string> {
    const { type, data } = options;
    const config = options.config as PaddleOCRConfig;
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
  }

  async precheck(ctx: PluginContext): Promise<boolean> {
    const config = ctx.cfg.ocr as PaddleOCRConfig;
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
  }
}
