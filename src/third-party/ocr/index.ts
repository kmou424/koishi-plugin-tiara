import { PluginContext } from "../../core/type";
import { OCRConfig } from "./config";
import OCRProviders from "./providers";
import { PrecheckFunc, PredictFunc, PredictOptions } from "./type";

export * from "./config";

class OCR {
  public static precheck: PrecheckFunc = async (
    ctx: PluginContext
  ): Promise<boolean> =>
    await OCRProviders[(ctx.cfg.ocr as OCRConfig).engine].precheck(ctx);

  public static predict: PredictFunc = async (
    ctx: PluginContext,
    options: PredictOptions
  ): Promise<string> =>
    await OCRProviders[options.config.engine].predict(ctx, options);
}

export default OCR;
