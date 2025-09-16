interface Template {
  readonly content: string;
  render(args: Object): string;
}

export { Template };
