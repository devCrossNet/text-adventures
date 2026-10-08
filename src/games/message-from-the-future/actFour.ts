import type { QuaireSelectOption } from 'quaire';
import { type GameQuestionDefinition, getDialog } from '@/quaire';

// only players who solved the notebook puzzle know this test
const sayNameOption: QuaireSelectOption = { label: 'Ask her to say your name.', value: 'sayName', next: 'sayNameTest' };
const knowsTheRule = { puzzleSolved: { answered: true } };

const doorOptions: Array<QuaireSelectOption> = [
  { label: 'Ask her something only Mila knows.', value: 'secret', next: 'secretTest' },
  { label: "Don't open the door.", value: 'dontOpen', next: 'standoff' },
  { label: "Open the door. It's your friend.", value: 'open', next: 'doorOpens' },
];

const finalDoorOptions: Array<QuaireSelectOption> = [
  { label: 'Okay. Open it.', value: 'open', next: 'doorOpens' },
  { label: "NO! Don't!", value: 'dontOpen', next: 'standoff' },
  { label: "You didn't stop her.", value: 'tooLate', next: 'doorOpens', timeout: true },
];

// Act 4: someone knocks at Aia's door
export const actFourQuestions: Array<GameQuestionDefinition> = [
  getDialog({
    id: 'knock',
    key: 'knock',
    lines: [
      'Aia: The battery is at 9%.',
      "Aia: I don't want to stop talking to you.",
      '[[silence:2500]]',
      '[[knock]]',
      'Aia: ...',
      'Aia: Did you hear that?',
      "Aia: No. Of course you didn't.",
      '[[knock]]',
      'Aia: Someone is at the door.',
      "Aia: It's 03:12. It's always 03:12.",
    ],
    next: 'knockChoice',
  }),
  {
    id: 'knockChoice',
    key: 'knockChoice',
    type: 'TIMED_SELECT',
    title: 'Aia: What do I do??',
    required: true,
    seconds: 10,
    options: [
      { label: 'Hide!', value: 'hide', next: 'hiding' },
      { label: 'Ask who it is.', value: 'ask', next: 'askWho' },
      { label: "Don't make a sound.", value: 'silent', next: 'staySilent' },
      { label: "You didn't answer.", value: 'noAnswer', next: 'noAnswer', timeout: true },
    ],
  },
  getDialog({
    id: 'hiding',
    key: 'hiding',
    lines: [
      'Aia: Okay. Okay.',
      "Aia: I'm under the stairs.",
      'Aia: The knocking stopped.',
      '[[silence:3000]]',
      'Aia: Now someone is talking. Right outside the door.',
      "!!Mila: it's me. it's mila. i know you're in there.",
      "Aia: That's her voice.",
      "Aia: That's Mila's voice.",
    ],
    next: 'milaAtDoor',
  }),
  getDialog({
    id: 'askWho',
    key: 'askWho',
    lines: [
      'Aia: W-who is it?',
      '[[pause:3000]]',
      "!!Mila: it's me. it's mila.",
      '!!Mila: i came back.',
      'Aia: Oh my god.',
    ],
    next: 'milaAtDoor',
  }),
  getDialog({
    id: 'staySilent',
    key: 'staySilent',
    lines: [
      'Aia: Okay. Not a sound.',
      '[[knock]]',
      '[[silence:2000]]',
      '[[knock]]',
      '!!Mila: i can hear you breathing.',
      "!!Mila: it's me. it's mila.",
      "Aia: That's Mila's voice.",
    ],
    next: 'milaAtDoor',
  }),
  getDialog({
    id: 'noAnswer',
    key: 'noAnswer',
    lines: [
      'Aia: <%= playerName %>?',
      'Aia: Please answer!',
      '[[knock]]',
      "Aia: Okay. I'll ask.",
      'Aia: Who is it?',
      '[[pause:3000]]',
      "!!Mila: it's me. it's mila.",
      'Aia: Mila?',
    ],
    next: 'milaAtDoor',
  }),
  getDialog({
    id: 'milaAtDoor',
    key: 'milaAtDoor',
    lines: [
      'Aia: She says she came back from the Quiet.',
      "Aia: She says it's cold in there. So cold.",
      '!!Mila: please. let me in. i missed you so much.',
      'Aia: She knows things.',
      'Aia: Our secret place. The song we made up when we were nine.',
      "Aia: <%= playerName %>... what if it's really her?",
    ],
    next: 'doorTest',
  }),
  {
    id: 'doorTest',
    key: 'doorTest',
    type: 'SINGLE_SELECT',
    title: 'Aia: What should I do?',
    required: true,
    options: doorOptions,
    variants: [{ when: knowsTheRule, options: [sayNameOption, ...doorOptions] }],
  },
  getDialog({
    id: 'secretTest',
    key: 'secretTest',
    lines: [
      'Aia: Mila. What was our secret place?',
      '[[pause:2500]]',
      '!!Mila: the old water tower. we carved our names into the ladder.',
      'Aia: ...',
      "Aia: That's right.",
      "Aia: That's RIGHT. Nobody else knows that!",
      "!!Mila: let me in. it's so cold out here.",
    ],
    next: 'finalDoor',
  }),
  {
    id: 'finalDoor',
    key: 'finalDoor',
    type: 'TIMED_SELECT',
    title: "Aia: I'm opening the door.",
    required: true,
    seconds: 8,
    options: finalDoorOptions,
    variants: [
      {
        when: knowsTheRule,
        options: [{ ...sayNameOption, label: 'Wait! Ask her to say your name!' }, ...finalDoorOptions],
      },
    ],
  },
  getDialog({
    id: 'sayNameTest',
    key: 'sayNameTest',
    lines: [
      'Aia: Mila.',
      'Aia: Say my name.',
      '[[pause:3000]]',
      '!!Mila: let me in.',
      'Aia: Say my name, Mila. Please.',
      '!!Mila: let me in let me in let me in let me in',
      '[[static]]',
      '[[knock]]',
      "Aia: It's not her.",
      "Aia: IT'S NOT HER.",
    ],
    next: 'escape',
  }),
  getDialog({
    id: 'standoff',
    key: 'standoff',
    lines: [
      "Aia: You're right.",
      "Aia: I'm not opening.",
      '!!Mila: why are you doing this to me',
      '[[knock]]',
      '!!Mila: you were always alone. you will always be alone.',
      'Aia: Stop it.',
      'Aia: Mila would never say that.',
      '[[silence:2000]]',
      'Aia: It stopped.',
    ],
    next: 'escape',
  }),
];
