import { PluginContext } from "./type";

class Global {
  private static ctx: PluginContext | null = null;

  public static set Context(ctx: PluginContext) {
    if (Global.ctx) {
      throw new Error("Context is already set");
    }
    Global.ctx = ctx;
  }

  public static get Context() {
    if (!Global.ctx) {
      throw new Error("Context is not set");
    }
    return Global.ctx;
  }
}

export default Global;
