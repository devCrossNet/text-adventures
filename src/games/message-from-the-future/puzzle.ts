import type { QuaireResult } from 'quaire';

// the coded word in the notebook: 14-1-13-5 is NAME when A is 1
export const isPuzzleSolution = (value: unknown): boolean => {
  const answer = String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');

  return answer === 'name' || answer === 'yourname';
};

export const hasSolvedPuzzle = (result: QuaireResult): boolean =>
  [result.puzzle1, result.puzzle2, result.puzzle3].some(isPuzzleSolution);
