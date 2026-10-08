import { type GameQuestionDefinition, getDialog } from '@/quaire';

// Act 2: little things about Aia's world do not fit
export const actTwoQuestions: Array<GameQuestionDefinition> = [
  {
    id: 'firstQuestion',
    key: 'firstQuestion',
    type: 'SINGLE_SELECT',
    title: 'Aia: You can ask me something too, if you want.',
    required: true,
    options: [
      { label: 'Who is Mila?', value: 'mila' },
      { label: 'Where are you writing from?', value: 'where' },
      { label: 'Are you okay?', value: 'okay' },
    ],
    next: 'firstAnswer',
  },
  getDialog({
    id: 'firstAnswer',
    key: 'firstAnswer',
    lines: [],
    variants: [
      {
        when: { firstQuestion: 'mila' },
        lines: [
          'Aia: Mila was my best friend.',
          'Aia: She went inside two years ago.',
          'Aia: I still write to her sometimes. She never answers.',
          'Aia: I thought this old thing could reach her. Silly, right?',
        ],
      },
      {
        when: { firstQuestion: 'where' },
        lines: [
          "Aia: From my great-grandfather's house.",
          'Aia: I live here alone now.',
          'Aia: The whole street is empty. The whole town, really.',
          "Aia: It's very quiet.",
        ],
      },
      {
        when: { firstQuestion: 'okay' },
        lines: [
          'Aia: Nobody asked me that in a long time.',
          "Aia: I'm okay. I think.",
          "Aia: It's just very quiet here.",
        ],
      },
    ],
    next: 'morning',
  }),
  {
    id: 'morning',
    key: 'morning',
    type: 'SINGLE_SELECT',
    title: 'Aia: What do you do in the morning? Like, a normal morning.',
    required: true,
    options: [
      { label: 'I get coffee and bread at the bakery.', value: 'bakery' },
      { label: 'I scroll through my phone in bed.', value: 'phone' },
      { label: 'I hit snooze. Five times.', value: 'snooze' },
    ],
    next: 'morningReply',
  },
  getDialog({
    id: 'morningReply',
    key: 'morningReply',
    lines: [],
    variants: [
      {
        when: { morning: 'bakery' },
        lines: [
          'Aia: Bakery?',
          'Aia: Wait, I know this word.',
          'Aia: A place where a person makes bread? With their hands?',
          'Aia: And you just go there? And talk to them?',
          "Aia: That's beautiful.",
        ],
      },
      {
        when: { morning: 'phone' },
        lines: [
          'Aia: Me too!',
          "Aia: Well, not on a device like this. It's so slow.",
          'Aia: No offense.',
          'Aia: Does it ever get boring? Talking to screens all day?',
        ],
      },
      {
        when: { morning: 'snooze' },
        lines: [
          'Aia: Ha!',
          "Aia: My house wakes me up. It opens the curtains and doesn't let me snooze.",
          "Aia: I tried once. It just said 'Good morning, Aia' louder.",
        ],
      },
    ],
    next: 'friends',
  }),
  {
    id: 'friends',
    key: 'friends',
    type: 'SINGLE_SELECT',
    title: 'Aia: When did you last meet a friend? In person, I mean.',
    required: true,
    options: [
      { label: 'Yesterday. We had dinner.', value: 'yesterday' },
      { label: "It's been a while, to be honest.", value: 'while' },
      { label: 'Why does that matter?', value: 'whyMatter' },
    ],
    next: 'friendsReply',
  },
  getDialog({
    id: 'friendsReply',
    key: 'friendsReply',
    lines: [],
    variants: [
      {
        when: { friends: 'yesterday' },
        lines: [
          'Aia: Dinner. Together. At one table.',
          "Aia: I haven't seen another person in 214 days.",
          'Aia: I counted.',
        ],
      },
      {
        when: { friends: 'while' },
        lines: ['Aia: Me too.', 'Aia: 214 days. I counted.', "Aia: It's nice to know I'm not the only one."],
      },
      {
        when: { friends: 'whyMatter' },
        lines: [
          "Aia: Sorry. It doesn't.",
          "Aia: It's just... I haven't seen another person in 214 days.",
          'Aia: I counted.',
        ],
      },
    ],
    next: 'theQuiet',
  }),
  getDialog({
    id: 'theQuiet',
    key: 'theQuiet',
    lines: [
      'Aia: Everyone I know went inside.',
      'Aia: Into the Quiet.',
      "Aia: It's hard to explain.",
      'Aia: You lie down, you close your eyes, and you are never alone again.',
      "Aia: They say it's better in there.",
      "Aia: I didn't want to go. So I stayed.",
    ],
    next: 'quietReaction',
  }),
  {
    id: 'quietReaction',
    key: 'quietReaction',
    type: 'SINGLE_SELECT',
    title: "Aia: You think I'm crazy, don't you?",
    required: true,
    options: [
      { label: 'A little. But keep talking.', value: 'keepTalking' },
      { label: "What is 'the Quiet'? A game?", value: 'game' },
      { label: 'Okay, this is a prank, right?', value: 'prank' },
    ],
    next: 'quietReply',
  },
  getDialog({
    id: 'quietReply',
    key: 'quietReply',
    lines: [],
    variants: [
      { when: { quietReaction: 'keepTalking' }, lines: ['Aia: Ha. Fair.', "Aia: I'd think so, too."] },
      {
        when: { quietReaction: 'game' },
        lines: ['Aia: I wish it was a game.', "Aia: You really don't know the Quiet?", 'Aia: Everyone knows it.'],
      },
      { when: { quietReaction: 'prank' }, lines: ['Aia: A prank?', 'Aia: No. I wish.'] },
    ],
    next: 'worldQuestion',
  }),
  {
    id: 'worldQuestion',
    key: 'worldQuestion',
    type: 'SINGLE_SELECT',
    title: 'Aia: Ask me anything about it. I know how it sounds.',
    required: true,
    options: [
      { label: 'How did it start?', value: 'start' },
      { label: 'What happens to the people inside?', value: 'inside' },
      { label: "Why didn't you go in?", value: 'why' },
    ],
    next: 'worldAnswer',
  },
  getDialog({
    id: 'worldAnswer',
    key: 'worldAnswer',
    lines: [],
    variants: [
      {
        when: { worldQuestion: 'start' },
        lines: [
          'Aia: It started with the Hum.',
          'Aia: A low sound, everywhere at once. In the walls. In the water pipes.',
          'Aia: The scientists said it was nothing.',
          'Aia: Then people started to dream the same dream.',
          'Aia: A quiet place. Warm. Nobody is ever alone there.',
          "Aia: And one night, they just... didn't wake up.",
        ],
      },
      {
        when: { worldQuestion: 'inside' },
        lines: [
          'Aia: Their bodies stay in bed. Breathing. Smiling.',
          'Aia: After a few days, the white vans come.',
          'Aia: The Collectors carry them out. Very gently.',
          'Aia: Nobody knows where they take them.',
          'Aia: Nobody asks anymore.',
        ],
      },
      {
        when: { worldQuestion: 'why' },
        lines: [
          'Aia: Because of Mila.',
          'Aia: The night she went in, she called me.',
          "Aia: She was laughing. She said: 'Come with me. It's so warm.'",
          'Aia: But her voice was wrong. Too slow. Like a recording.',
          'Aia: I hung up. And I stayed.',
        ],
      },
    ],
    next: 'nightVisitors',
  }),
  getDialog({
    id: 'nightVisitors',
    key: 'nightVisitors',
    lines: [
      "Aia: There's one more thing.",
      'Aia: Sometimes, at night, someone knocks.',
      'Aia: Someone you know. Someone who went in.',
      'Aia: Mrs. Okafor from next door opened the door for her son last month.',
      'Aia: Her house has been dark ever since.',
      '[[silence:2000]]',
      "Aia: Sorry. I don't know why I'm telling you this.",
    ],
    next: 'visitorsReaction',
  }),
  {
    id: 'visitorsReaction',
    key: 'visitorsReaction',
    type: 'SINGLE_SELECT',
    title: "Aia: You think it's just stories, right?",
    required: true,
    options: [
      { label: "That's terrifying.", value: 'scared' },
      { label: "There's an explanation for everything.", value: 'rational' },
      { label: 'Lock your door tonight.', value: 'lock' },
    ],
    next: 'visitorsReply',
  },
  getDialog({
    id: 'visitorsReply',
    key: 'visitorsReply',
    lines: [],
    variants: [
      {
        when: { visitorsReaction: 'scared' },
        lines: ['Aia: It is.', "Aia: But it's nice that someone is scared with me."],
      },
      { when: { visitorsReaction: 'rational' }, lines: ['Aia: Maybe.', 'Aia: I used to think that, too.'] },
      {
        when: { visitorsReaction: 'lock' },
        lines: ['Aia: I always do.', 'Aia: Three locks. And a chair under the handle.'],
      },
    ],
    next: 'clocks',
  }),
  getDialog({
    id: 'clocks',
    key: 'clocks',
    lines: [
      'Aia: Can I ask you something?',
      'Aia: Your messages show a time. <%= time %>.',
      'Aia: Is that right? Is it <%= time %> for you?',
      'Aia: Every clock in this house says 03:12.',
      'Aia: That was the moment Mila went in.',
      'Aia: The moment they all went in.',
      'Aia: The clocks stopped and never started again.',
    ],
    next: 'deviceClue',
  }),
];
