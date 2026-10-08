import { type GameQuestionDefinition, getDialog } from '@/quaire';

export const brandStoryLineQuestions: Array<GameQuestionDefinition> = [
  getDialog({
    id: 200,
    key: 'brandIntroDialog',
    lines: ['Aia: Hm, there is a logo on the back...', 'Aia: But it is too scratched to read'],
    end: 'TO BE CONTINUED...',
  }),
];
