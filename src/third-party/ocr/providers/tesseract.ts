import { Schema } from "koishi";
import { PluginContext } from "../../../core/type";
import { RuntimeUtil } from "../../../packages/util/runtime";
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
    throw RuntimeUtil.TODO;
  }

  async precheck(ctx: PluginContext): Promise<boolean> {
    throw RuntimeUtil.TODO;
  }
}
