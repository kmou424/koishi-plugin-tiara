import { Schema } from "koishi";
import { CoreUtil } from "../../../core";
import { PluginContext } from "../../../core/type";
import { OCRProvider, PredictOptions } from "../type";

export interface TesseractOCRConfig {
  engine: "tesseract";
  lang: string;
}

export const TesseractOCRConfig: Schema<TesseractOCRConfig> = Schema.object({
  engine: Schema.const("tesseract").required(),
  lang: Schema.string().description("语言").default("eng"),
});

export class TesseractOCRProvider extends OCRProvider {
  enabled = false;

  async predict(ctx: PluginContext, options: PredictOptions): Promise<string> {
    throw CoreUtil.Runtime.TODO;
  }

  async precheck(ctx: PluginContext): Promise<boolean> {
    throw CoreUtil.Runtime.TODO;
  }
}
