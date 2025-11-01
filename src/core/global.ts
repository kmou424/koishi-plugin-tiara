import { PluginContext } from "./type";

class Global {
  private static ctx: PluginContext | null = null;

  public static set Context(ctx: PluginContext) {
    if (!Global.ctx) {
      Global.ctx = ctx;
    } else {
      Global.ctx.override(ctx());
    }
  }

  public static get Context() {
    return Global.ctx;
  }
}

export default Global;
