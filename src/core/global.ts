import { PluginContext } from "./type";

class Global {
  private static ctx: PluginContext;

  public static set Context(ctx: PluginContext) {
    Global.ctx = ctx;
  }

  public static get Context() {
    return Global.ctx;
  }
}

export default Global;
