import { TODO } from "@tiara/util/runtime";
import axios from "axios";
import { Schema } from "koishi";

type PerdictFunc = (options: BaseOCR.Options) => Promise<string>;
type PrecheckFunc = (config: BaseOCR.Config) => Promise<boolean>;

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

  export const predict: PerdictFunc = async (options) => {
    const { type, data } = options;
    const config = options.config as Config;
    const url = new URL(config.endpoint);
    url.pathname = "/ocr/predict";

    const formData: FormData = new FormData();
    formData.append("type", type);

    switch (type) {
      case "url":
        formData.append("image_url", data);
        break;
      case "base64":
        formData.append("base64_str", data);
        break;
      case "path":
        formData.append("image_path", data);
        break;
      case "file":
        formData.append("image", data as Blob);
        break;
    }

    const resp = await axios.post(url.toString(), formData, {
      timeout: 5000,
    });
    return (resp.data.data[0] as object[][]).map((item) => item[1][0]).join("");
  };

  export const precheck: PrecheckFunc = async (c) => {
    const config = c as Config;
    const url = new URL(config.endpoint);
    url.pathname = "/ocr/health";
    try {
      const resp = await axios.get(url.toString(), {
        timeout: 5000,
      });
      return resp.status === 200;
    } catch (error) {
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

  export const predict: PerdictFunc = async (options) => {
    // TODO: implement Tesseract OCR
    throw TODO;
  };

  export const precheck: PrecheckFunc = async (config) => {
    // TODO: implement Tesseract OCR
    throw TODO;
  };
}

export namespace BaseOCR {
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

  export interface Options {
    config: Config;
    type: "url" | "base64" | "path" | "file";
    data: string | Blob;
  }

  export const precheck: PrecheckFunc = async (
    config: Config
  ): Promise<boolean> => {
    return await {
      paddleocr: PaddleOCR.precheck,
      tesseract: TesseractOCR.precheck,
    }[config.engine](config);
  };

  export const predict: PerdictFunc = async (
    options: Options
  ): Promise<string> => {
    return await {
      paddleocr: PaddleOCR.predict,
      tesseract: TesseractOCR.predict,
    }[options.config.engine](options);
  };
}
