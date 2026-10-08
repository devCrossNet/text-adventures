import { getClock, interpolate, isGlitch, parseEffect, sleep, stripGlitch } from '@/utils';

describe('utils', () => {
  test('should replace placeholders with answers', () => {
    expect(interpolate('Nice to meet you, <%= playerName %>!', { playerName: 'Neo' })).toBe('Nice to meet you, Neo!');
  });

  test('should replace missing answers with an empty string', () => {
    expect(interpolate('Hi <%=name%>!', {})).toBe('Hi !');
  });

  test('should wait', async () => {
    vi.useFakeTimers();
    const promise = sleep(100);
    await vi.advanceTimersByTimeAsync(100);

    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });
});

describe('clock and effects', () => {
  test('should format the real time of the player', () => {
    expect(getClock(new Date(2026, 9, 8, 3, 7))).toEqual({ time: '03:07', weekday: 'Thursday' });
  });

  test.each([
    ['[[knock]]', { name: 'knock' }],
    ['[[pause:3000]]', { name: 'pause', duration: 3000 }],
    ['[You blocked the number.]', null],
    ['Aia: [[knock]]', null],
  ])('should parse "%s"', (line, effect) => {
    expect(parseEffect(line)).toEqual(effect);
  });

  test('should detect and strip glitch lines', () => {
    expect(isGlitch('!!Mila: let me in')).toBe(true);
    expect(stripGlitch('!!Mila: let me in')).toBe('Mila: let me in');
    expect(stripGlitch('Aia: hi')).toBe('Aia: hi');
  });
});
