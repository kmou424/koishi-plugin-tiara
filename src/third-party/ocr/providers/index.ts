import { OCRProvider } from "../type";
import { PaddleOCRProvider } from "./paddleocr";
import { TesseractOCRProvider } from "./tesseract";

export * from "./paddleocr";
export * from "./tesseract";

export type OCRProviderType = "paddleocr" | "tesseract";

const OCRProviders: Record<OCRProviderType, OCRProvider> = {
  paddleocr: new PaddleOCRProvider(),
  tesseract: new TesseractOCRProvider(),
};

export default OCRProviders;
