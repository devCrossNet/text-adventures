import type { GameQuestionDefinition } from '@/quaire';
import { ageStoryLineQuestions } from './ageStoryLine';
import { brandStoryLineQuestions } from './brandStoryLine';
import { introQuestions } from './intro';
import { locationStoryLineQuestions } from './locationStoryLine';

export const chapterOneQuestions: Array<GameQuestionDefinition> = [
  ...introQuestions,
  ...locationStoryLineQuestions,
  ...brandStoryLineQuestions,
  ...ageStoryLineQuestions,
];
