import { interpolate, sleep } from '@/utils';

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
