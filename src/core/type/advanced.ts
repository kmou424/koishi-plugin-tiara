import { Session } from "koishi";
import { PluginContext } from "./context";

export type FilterFunc = (session: Session) => Promise<boolean>;
export type FilterCallback = (ctx: PluginContext) => Promise<void>;

export type Filter = {
  when(filterFunc: FilterFunc): Filter;
  then(callback: FilterCallback): void;
};

export type IFilter = Filter & {
  validate(ctx: PluginContext, session: Session): Promise<void>;
};
