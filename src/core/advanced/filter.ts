import { Session } from "koishi";
import {
  Filter,
  FilterCallback,
  FilterFunc,
  IFilter,
  PluginContext,
} from "../type";

export class BaseFilter implements IFilter {
  private callback: FilterCallback | null = null;
  private filterFuncs: FilterFunc[] = [];

  when(filterFunc: FilterFunc): Filter {
    this.filterFuncs.push(filterFunc);
    return this;
  }

  then(callback: FilterCallback): void {
    this.callback = callback;
  }

  async validate(ctx: PluginContext, session: Session): Promise<void> {
    const results = await Promise.all(
      this.filterFuncs.map(async (filter) => await filter(session))
    );
    if (results.every((result) => result)) {
      if (this.callback) {
        await this.callback(ctx);
      }
    }
  }
}

export const createBaseFilter = (): Filter => {
  return new BaseFilter();
};
