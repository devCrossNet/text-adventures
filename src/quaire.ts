import {
  defaultComponents,
  Quaire,
  type QuaireComponent,
  type QuaireQuestion,
  type QuaireQuestionDefinition,
  type QuaireQuestionDefinitionBase,
  type QuaireResult,
  type QuaireSelectOption,
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

// the option that is saved when the time is up, it is not shown as a button
export type TimeoutOption = QuaireSelectOption & { timeout: true };

// a single select with a countdown
export type TimedSelectDefinition = QuaireQuestionDefinitionBase<
  'TIMED_SELECT',
  { options: Array<QuaireSelectOption>; seconds: number }
>;

export type GameQuestionDefinition = QuaireQuestionDefinition | DialogDefinition | TimedSelectDefinition;

export type GameQuestion = QuaireQuestion<GameQuestionDefinition>;

export type GameQuaire = Quaire<QuaireResult, GameQuestionDefinition>;

export const dialog: QuaireComponent<DialogDefinition> = {};

// the timeout is a hidden option, so validation and branching work like a single select
export const timedSelect = defaultComponents.SINGLE_SELECT as QuaireComponent<TimedSelectDefinition>;

export const components = { DIALOG: dialog, TIMED_SELECT: timedSelect };

export const isTimeoutOption = (option: QuaireSelectOption): option is TimeoutOption => option.timeout === true;

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
