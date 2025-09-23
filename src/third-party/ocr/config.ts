import { Schema } from "koishi";
import OCRProviders, {
  OCRProviderType,
  PaddleOCRConfig,
  TesseractOCRConfig,
} from "./providers";

export type OCRConfigOptions = PaddleOCRConfig | TesseractOCRConfig;

export const OCRConfigOptions: Schema<OCRConfigOptions> = Schema.union([
  PaddleOCRConfig,
  TesseractOCRConfig,
]);

export type OCRConfig = {
  engine: OCRProviderType;
};

export const OCRConfig: Schema<OCRConfig> = Schema.object({
  engine: Schema.union([
    Schema.const("paddleocr")
      .description("PaddleOCR")
      .disabled(!OCRProviders.paddleocr.enabled),
    Schema.const("tesseract")
      .description("Tesseract")
      .disabled(!OCRProviders.tesseract.enabled),
  ])
    .default("paddleocr")
    .description("OCR 引擎"),
}).description("OCR 配置");
