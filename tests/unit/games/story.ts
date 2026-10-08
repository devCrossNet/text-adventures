import { createQuaire, type GameQuaire } from '@/quaire';
import { questions } from '@/games/message-from-the-future';

// a kind player who solves the puzzle at once: Aia trusts them
export const warmPath = {
  actOne: ['who', 'yes', 'rain', 'Neo'],
  actTwo: ['okay', 'bakery', 'yesterday', 'keepTalking', 'why', 'scared'],
  actThree: ['2026', 'yes', 'now', 'name'],
};

// a cold player who fails the puzzle: Aia does not trust them
export const coldPath = {
  actOne: ['wrongNumber', 'busy', 'sun', 'Neo'],
  actTwo: ['mila', 'phone', 'whyMatter', 'prank', 'start', 'rational'],
  actThree: ['2026', 'prove', 'worldCup', 'coincidence', 'house', 'door', 'help'],
};

export const untilKnock = (path: typeof warmPath) => [...path.actOne, ...path.actTwo, ...path.actThree];

// answers all dialogs in between, like the game does after printing the lines
export const playDialogs = (Q: GameQuaire) => {
  let question = Q.getActiveQuestion();

  while (question?.type === 'DIALOG' && !question.hasValue) {
    Q.saveAnswer(true);
    question = Q.getActiveQuestion();
  }
};

export const play = (Q: GameQuaire, answers: Array<unknown>) => {
  answers.forEach((answer) => {
    playDialogs(Q);
    Q.saveAnswer(answer);
  });
  playDialogs(Q);

  return Q;
};

export const playNew = (answers: Array<unknown>) => play(createQuaire(questions), answers);
