import { type GameQuestionDefinition, getDialog } from '@/quaire';

export const introQuestions: Array<GameQuestionDefinition> = [
  getDialog({
    id: 1,
    key: 'introDialog',
    lines: [
      'Hello.......',
      'Hello?........',
      'Someone here? ....... ..',
      'I wonder what this old thing does ¯\\_(ツ )_/¯',
    ],
    next: 2,
  }),
  {
    id: 2,
    key: 'receivedMessages',
    type: 'SINGLE_SELECT',
    title: 'Can someone read this, heeeeelllloooooooo?',
    required: true,
    options: [
      { label: "Yeah, what's up?", value: 'Yes', next: 4 },
      { label: "Nope, that's too creepy!", value: 'No', next: 3 },
    ],
  },
  // END OF GAME
  getDialog({
    id: 3,
    key: 'notReceivedMessagesDialog',
    lines: [
      'Hm, I guess this old thing is broken then',
      'I will put it in the trash',
      '... I wonder if a museum would be interested',
      'That must be like 100 years old O_O',
      'Anyway, bye!',
    ],
    end: 'THE END',
  }),
  // GATHER USER INFORMATION
  getDialog({
    id: 4,
    key: 'receivedMessagesDialog',
    lines: ["Ha, cool! I didn't expect that his old thing really works"],
    next: 5,
  }),
  {
    id: 5,
    key: 'howAreYou',
    type: 'SINGLE_SELECT',
    title: 'How are you doing?',
    required: true,
    options: [
      { label: 'I am good, and you?', value: 'Good' },
      { label: 'I have ups and downs.', value: 'Bad' },
    ],
    next: 6,
  },
  getDialog({
    id: 6,
    key: 'howAreYouDialog',
    lines: [],
    variants: [
      {
        when: { howAreYou: 'Good' },
        lines: [
          'Awesome!',
          'Great to hear.',
          'I found this old device',
          "I'm not really sure what it is, but...",
          'it looks like one from the history books',
          'I think they where called mobile phones',
          'My name is Aia',
        ],
      },
      {
        when: { howAreYou: 'Bad' },
        lines: ["I didn't hear this in a while", 'Usually, people are happy!', 'My name is Aia'],
      },
    ],
    next: 7,
  }),
  // PlayerName
  {
    id: 7,
    key: 'playerName',
    type: 'INPUT',
    title: "Aia: What's your name?",
    required: true,
    next: 8,
  },
  getDialog({
    id: 8,
    key: 'niceToMeetYouDialog',
    lines: [
      'Aia: Nice to meet you, <%= playerName %>!',
      'Aia: How can you read my messages?',
      'Aia: Do you also have one of those old mobile phone devices?',
    ],
    next: 9,
  }),
  {
    id: 9,
    key: 'whereDidYouFindTheMobile',
    type: 'SINGLE_SELECT',
    title: '>> I need to ask you something?',
    required: true,
    options: [
      { label: 'Where did you find the mobile phone?', value: 'Location', next: 100 },
      { label: 'What model do you have?', value: 'Brand', next: 200 },
      { label: 'Why do you call it old?', value: 'Age', next: 300 },
    ],
  },
];
