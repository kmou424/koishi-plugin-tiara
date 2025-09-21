import { Schema } from "koishi";
import { PaddleOCR, TesseractOCR } from "./providers";

export type ConfigOptions = PaddleOCR.Config | TesseractOCR.Config;

export const ConfigOptions: Schema<ConfigOptions> = Schema.union([
  PaddleOCR.Config,
  TesseractOCR.Config,
]);

export type Config = {
  engine: "paddleocr" | "tesseract";
};

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
}).description("OCR 配置");
