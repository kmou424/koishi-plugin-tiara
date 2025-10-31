import { PluginContext } from "../core/type";

export interface RepositoryProvider {
  initialize(ctx: PluginContext): Promise<void>;
  dispose(ctx: PluginContext): void;
}
