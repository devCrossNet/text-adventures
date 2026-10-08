import type { QuaireResult } from 'quaire';

// Aia only dares to go outside when the player was kind to her
export const WARMTH_TO_GO_OUTSIDE = 3;

export const getWarmth = (result: QuaireResult): number =>
  [
    result.askAnyway === 'yes',
    result.firstQuestion === 'okay',
    result.morning === 'bakery',
    result.friends === 'yesterday' || result.friends === 'while',
    result.quietReaction === 'keepTalking',
    result.believe === 'yes',
  ].filter(Boolean).length;
