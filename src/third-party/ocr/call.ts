import { PluginContext } from "../../core/type";
import { PaddleOCR, TesseractOCR } from "./providers";
import { PrecheckFunc, PredictFunc, PredictOptions } from "./type";

export const Precheck: PrecheckFunc = async (
  ctx: PluginContext
): Promise<boolean> =>
  await {
    paddleocr: PaddleOCR.Precheck,
    tesseract: TesseractOCR.Precheck,
  }[ctx.cfg.engine](ctx);

export const Predict: PredictFunc = async (
  ctx: PluginContext,
  options: PredictOptions
): Promise<string> =>
  await {
    paddleocr: PaddleOCR.Predict,
    tesseract: TesseractOCR.Predict,
  }[options.config.engine](ctx, options);
