import type { GameQuestionDefinition } from '@/quaire';
import { actFiveQuestions } from './actFive';
import { actFourQuestions } from './actFour';
import { actOneQuestions } from './actOne';
import { actThreeQuestions } from './actThree';
import { actTwoQuestions } from './actTwo';
import { endingQuestions } from './endings';

export const questions: Array<GameQuestionDefinition> = [
  ...actOneQuestions,
  ...actTwoQuestions,
  ...actThreeQuestions,
  ...actFourQuestions,
  ...actFiveQuestions,
  ...endingQuestions,
];
