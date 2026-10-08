export const sleep = (ms: number): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// replaces placeholders like `<%= playerName %>` with the answers of the result
export const interpolate = (line: string, result: Record<string, unknown>): string =>
  line.replace(/<%=\s*(\w+)\s*%>/g, (_match, key: string) => String(result[key] ?? ''));

// the real time of the player, for placeholders like `<%= time %>`
export const getClock = (date: Date) => ({
  time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
  weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
});

export type Effect = { name: string; duration?: number };

// dialog lines like `[[knock]]` or `[[pause:3000]]` are effects, not text
export const parseEffect = (line: string): Effect | null => {
  const match = line.match(/^\[\[(\w+)(?::(\d+))?\]\]$/);

  if (!match) {
    return null;
  }

  return match[2] ? { name: match[1], duration: Number(match[2]) } : { name: match[1] };
};

// lines that start with `!!` are shown with a glitch effect
export const GLITCH_PREFIX = '!!';

export const isGlitch = (line: string) => line.startsWith(GLITCH_PREFIX);

export const stripGlitch = (line: string) => (isGlitch(line) ? line.slice(GLITCH_PREFIX.length) : line);
