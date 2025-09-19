import { PluginContext } from "@tiara/core/type";
import { TODO } from "@tiara/util/runtime";
import axios from "axios";
import { Schema } from "koishi";

type PerdictFunc = (
  ctx: PluginContext,
  options: OCR.Options
) => Promise<string>;

type PrecheckFunc = (ctx: PluginContext) => Promise<boolean>;

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

  export const Predict: PerdictFunc = async (ctx, options) => {
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
        timeout: 5000,
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

export namespace TesseractOCR {
  export const Enabled = false;
  export interface Config {
    engine: "tesseract";
    lang: string;
  }

  export const Config: Schema<Config> = Schema.object({
    engine: Schema.const("tesseract").required(),
    lang: Schema.string().description("语言").default("eng"),
  }).description("Tesseract 配置");

  export const Predict: PerdictFunc = async (ctx, options) => {
    // TODO: implement Tesseract OCR
    throw TODO;
  };

  export const Precheck: PrecheckFunc = async (ctx) => {
    // TODO: implement Tesseract OCR
    throw TODO;
  };
}

export namespace OCR {
  export interface Config {
    engine: "paddleocr" | "tesseract";
  }

  export const Config: Schema<Config> = Schema.object({
    engine: Schema.union([
      Schema.const("paddleocr")
        .description("PaddleOCR")
        .disabled(!PaddleOCR.Enabled),
      Schema.const("tesseract")
        .description("Tesseract")
        .disabled(!TesseractOCR.Enabled),
    ])
      .default("paddleocr")
      .description("OCR 引擎"),
  });

  export type ConfigOptions = PaddleOCR.Config | TesseractOCR.Config;

  export const ConfigOptions: Schema<ConfigOptions> = Schema.union([
    PaddleOCR.Config,
    TesseractOCR.Config,
  ]);

  export interface Options {
    config: Config;
    type: "url" | "base64" | "path";
    data: string;
  }

  export const Precheck: PrecheckFunc = async (
    ctx: PluginContext
  ): Promise<boolean> =>
    await {
      paddleocr: PaddleOCR.Precheck,
      tesseract: TesseractOCR.Precheck,
    }[ctx.cfg.engine](ctx);

  export const Predict: PerdictFunc = async (
    ctx: PluginContext,
    options: Options
  ): Promise<string> =>
    await {
      paddleocr: PaddleOCR.Predict,
      tesseract: TesseractOCR.Predict,
    }[options.config.engine](ctx, options);
}
