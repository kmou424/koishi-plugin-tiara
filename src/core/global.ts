import { ORM } from "./orm";
import { PluginContext } from "./type";

class Global {
  private static ctx: PluginContext;
  private static orm: ORM;

  public static set Context(ctx: PluginContext) {
    Global.ctx = ctx;
  }

  public static get Context() {
    return Global.ctx;
  }

  public static set ORM(orm: ORM) {
    Global.orm = orm;
  }

  public static get ORM() {
    return Global.orm;
  }
}

export default Global;
