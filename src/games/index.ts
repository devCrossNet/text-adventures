import type { GameQuestionDefinition } from '@/quaire';

const games = import.meta.glob<{ questions: Array<GameQuestionDefinition> }>('./*/index.ts');

export const loadGame = async (id: string): Promise<Array<GameQuestionDefinition>> => {
  const load = games[`./${id}/index.ts`];

  if (!load) {
    throw new Error(`Unknown game: ${id}`);
  }

  return (await load()).questions;
};
