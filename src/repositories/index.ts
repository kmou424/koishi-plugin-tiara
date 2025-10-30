import Global from "../core/global";
import { PluginContext } from "../core/type";
import { PropertyRepositoryProvider } from "./property";
import { RevokeListenerRepositoryProvider } from "./revoke-listener";

export { GetPropertyRepository } from "./property";
export { GetRevokeListenerRepository } from "./revoke-listener";

const PROVIDERS = [
  PropertyRepositoryProvider,
  RevokeListenerRepositoryProvider,
];

export class Repositories {
  static async initialize(ctx: PluginContext): Promise<void> {
    for (const provider of PROVIDERS) {
      await provider.initialize(ctx);
    }
  }

  static async dispose(ctx: PluginContext): Promise<void> {
    for (const provider of PROVIDERS) {
      provider.dispose(ctx);
    }
    await Global.ORM.dispose();
  }
}
