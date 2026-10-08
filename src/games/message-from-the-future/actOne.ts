import { type GameQuestionDefinition, getDialog } from '@/quaire';

// Act 1: someone writes to the wrong number
export const actOneQuestions: Array<GameQuestionDefinition> = [
  getDialog({
    id: 'intro',
    key: 'intro',
    lines: ['Hello?', 'Mila? Is that you?', 'It finally works!', "I've been trying to reach you for so long."],
    next: 'whoIsThis',
  }),
  {
    id: 'whoIsThis',
    key: 'whoIsThis',
    type: 'SINGLE_SELECT',
    title: 'Mila?? Please say something.',
    required: true,
    options: [
      { label: 'Sorry, wrong number.', value: 'wrongNumber', next: 'apology' },
      { label: 'Who is this?', value: 'who', next: 'apology' },
      { label: "Don't answer.", value: 'ignore', next: 'stillThere' },
    ],
  },
  getDialog({
    id: 'stillThere',
    key: 'stillThere',
    lines: ['...', 'I can see that you read my message.', 'Please.', 'Just one word.'],
    next: 'secondChance',
  }),
  {
    id: 'secondChance',
    key: 'secondChance',
    type: 'SINGLE_SELECT',
    title: 'Please.',
    required: true,
    options: [
      { label: 'Fine. Hi.', value: 'hi', next: 'apology' },
      { label: 'Block the number.', value: 'block', next: 'blocked' },
    ],
  },
  getDialog({
    id: 'apology',
    key: 'apology',
    lines: [],
    variants: [
      {
        when: { whoIsThis: 'wrongNumber' },
        lines: ['Oh.', "Oh no. I'm sorry.", 'I thought...', 'Never mind.', 'Wrong number. Of course it is.'],
      },
      {
        when: { whoIsThis: 'who' },
        lines: [
          "You don't know me?",
          "Then you're not Mila.",
          'Sorry. I thought...',
          'Never mind. Wrong number, I guess.',
        ],
      },
      {
        when: { secondChance: 'hi' },
        lines: ['Hi!', 'Sorry for all the messages.', 'I thought you were someone else.', 'Wrong number, I guess.'],
      },
    ],
    next: 'askAnyway',
  }),
  {
    id: 'askAnyway',
    key: 'askAnyway',
    type: 'SINGLE_SELECT',
    title: 'Can I ask you something anyway?',
    required: true,
    options: [
      { label: 'Sure, go ahead.', value: 'yes' },
      { label: "I'm kind of busy.", value: 'busy' },
    ],
    next: 'weatherIntro',
  },
  getDialog({
    id: 'weatherIntro',
    key: 'weatherIntro',
    lines: [],
    variants: [
      { when: { askAnyway: 'yes' }, lines: ['Thank you!', "It's a strange question. Don't laugh."] },
      { when: { askAnyway: 'busy' }, lines: ['Oh. Okay.', "It's just one question. I promise."] },
    ],
    next: 'weather',
  }),
  {
    id: 'weather',
    key: 'weather',
    type: 'SINGLE_SELECT',
    title: "What's the weather like where you are?",
    required: true,
    options: [
      { label: "It's raining.", value: 'rain' },
      { label: 'Sunny and warm.', value: 'sun' },
      { label: 'Cold and grey. The usual.', value: 'grey' },
    ],
    next: 'weatherReply',
  },
  getDialog({
    id: 'weatherReply',
    key: 'weatherReply',
    lines: [],
    variants: [
      {
        when: { weather: 'rain' },
        lines: ['Raining? Really?', "I've only ever read about rain.", '...', 'I mean, it rarely rains here.'],
      },
      {
        when: { weather: 'sun' },
        lines: ['That sounds nice.', "Here it's always 21 degrees.", 'They keep it that way.'],
      },
      {
        when: { weather: 'grey' },
        lines: ['Grey sounds nice, actually.', 'Here every day is the same.', '21 degrees. Always.'],
      },
    ],
    next: 'playerName',
  }),
  {
    id: 'playerName',
    key: 'playerName',
    type: 'INPUT',
    title: "I'm Aia, by the way. What's your name?",
    required: true,
    next: 'niceToMeetYou',
  },
  getDialog({
    id: 'niceToMeetYou',
    key: 'niceToMeetYou',
    lines: [
      'Aia: <%= playerName %>.',
      "Aia: That's a nice name. Very... old-fashioned.",
      'Aia: Sorry! I mean classic.',
      "Aia: I don't talk to people much. I forgot how it works.",
    ],
    next: 'firstQuestion',
  }),
];
