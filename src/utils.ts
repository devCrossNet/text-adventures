export const sleep = (ms: number): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// replaces placeholders like `<%= playerName %>` with the answers of the result
export const interpolate = (line: string, result: Record<string, unknown>): string =>
  line.replace(/<%=\s*(\w+)\s*%>/g, (_match, key: string) => String(result[key] ?? ''));
