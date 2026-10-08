import { type GameQuestionDefinition, getDialog } from '@/quaire';

export const ageStoryLineQuestions: Array<GameQuestionDefinition> = [
  getDialog({
    id: 300,
    key: 'ageIntroDialog',
    lines: ['Aia: Old? Nobody uses mobile phones anymore', 'Aia: They were replaced a long time ago'],
    end: 'TO BE CONTINUED...',
  }),
];
