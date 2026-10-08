import { loadGame } from '@/games';
import { questions } from '@/games/message-from-the-future';

describe('loadGame', () => {
  test('should load the questions of a game', async () => {
    await expect(loadGame('message-from-the-future')).resolves.toBe(questions);
  });

  test('should fail for an unknown game', async () => {
    await expect(loadGame('unknown')).rejects.toThrow('Unknown game: unknown');
  });
});
