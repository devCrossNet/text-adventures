import { type GameQuestionDefinition, getDialog } from '@/quaire';

export const locationStoryLineQuestions: Array<GameQuestionDefinition> = [
  getDialog({
    id: 100,
    key: 'locationIntroDialog',
    lines: ['Aia: I found it...', 'Aia: In the attic of my Grandpas house', 'Aia: It was hidden in an old Box'],
    end: 'TO BE CONTINUED...',
  }),
];
