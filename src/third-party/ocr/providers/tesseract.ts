import { TODO } from "@tiara/util/runtime";
import { Schema } from "koishi";
import { PerdictFunc, PrecheckFunc } from "../type";

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
