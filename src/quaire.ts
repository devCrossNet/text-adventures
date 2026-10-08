import {
  Quaire,
  type QuaireComponent,
  type QuaireQuestion,
  type QuaireQuestionDefinition,
  type QuaireQuestionDefinitionBase,
  type QuaireResult,
} from 'quaire';

// a dialog prints its lines and is answered with `true` when all lines are shown
export type DialogDefinition = QuaireQuestionDefinitionBase<
  'DIALOG',
  {
    lines: Array<string>;
    // text that is shown when the game ends after this dialog, e.g. "THE END"
    end?: string;
  }
>;

export type GameQuestionDefinition = QuaireQuestionDefinition | DialogDefinition;

export type GameQuestion = QuaireQuestion<GameQuestionDefinition>;

export type GameQuaire = Quaire<QuaireResult, GameQuestionDefinition>;

export const dialog: QuaireComponent<DialogDefinition> = {};

export const components = { DIALOG: dialog };

export const createQuaire = (questions: Array<GameQuestionDefinition>, result?: QuaireResult): GameQuaire =>
  new Quaire<QuaireResult, GameQuestionDefinition>({ questions, result, components });

export const getDialog = (
  definition: Omit<DialogDefinition, 'type' | 'title'> & Partial<Pick<DialogDefinition, 'title'>>,
): DialogDefinition => ({
  type: 'DIALOG',
  title: '',
  required: true,
  ...definition,
});
