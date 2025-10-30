import { PropertyValue, TypedProperty } from "./libs/property";

const Properties: Record<string, TypedProperty<PropertyValue>> = {
  "ocr.enabled": new TypedProperty("ocr.enabled", false),
};

export default Properties;
