import * as OCRCall from "./call";
import * as OCRConfig from "./config";

namespace OCR {
  export type Config = OCRConfig.Config;
  export type ConfigOptions = OCRConfig.ConfigOptions;
  export const Config = OCRConfig.Config;
  export const ConfigOptions = OCRConfig.ConfigOptions;
  export const Precheck = OCRCall.Precheck;
  export const Predict = OCRCall.Predict;
}

export default OCR;
