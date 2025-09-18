export interface Template {
  render(args: Object): string;
  readonly templates: Record<string, string>;
}
