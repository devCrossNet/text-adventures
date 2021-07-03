import { QuaireComponentType } from "quaire";
import { MyItem } from "../../../views/MyQuaire";
import { getDialogItem } from "@/utils";

export const introItems: Array<MyItem> = [
  {
    ...getDialogItem({
      id: 1,
      resultProperty: "introDialog",
      dialogOptions: [
        "Hello.......",
        "Hello?........",
        "Someone here? ....... ..",
        "I wonder what this old thing does ¯\\_(ツ )_/¯",
      ],
      nextItemId: 2,
    }),
  },
  {
    id: 2,
    resultProperty: "receivedMessages",
    dependsOnResultProperties: [],
    componentType: QuaireComponentType.SINGLE_SELECT,
    question: "Can someone read this, heeeeelllloooooooo?",
    description: "",
    required: true,
    selectOptions: [
      {
        label: "Yeah, what's up?",
        value: "Yes",
        nextItemId: 4,
      },
      {
        label: "Nope, that's too creepy!",
        value: "No",
        nextItemId: 3,
      },
    ],
  },
  // END OF GAME
  {
    ...getDialogItem({
      id: 3,
      resultProperty: "notReceivedMessagesDialog",
      dialogOptions: [
        "Hm, I guess this old thing is broken then",
        "I will put it in the trash",
        "... I wonder if a museum would be interested",
        "That must be like 100 years old O_O",
        "Anyway, bye!",
      ],
      nextItemId: 99999,
    }),
  },
  // GATHER USER INFORMATION
  {
    ...getDialogItem({
      id: 4,
      resultProperty: "receivedMessagesDialog",
      dialogOptions: [
        "Ha, cool! I didn't expect that his old thing really works",
      ],
      nextItemId: 5,
    }),
  },
  {
    id: 5,
    resultProperty: "howAreYou",
    dependsOnResultProperties: [],
    componentType: QuaireComponentType.SINGLE_SELECT,
    question: "How are you doing?",
    description: "",
    required: true,
    selectOptions: [
      {
        label: "I am good, and you?",
        value: "Good",
        nextItemId: 6,
      },
      {
        label: "I have ups and downs.",
        value: "Bad",
        nextItemId: 6,
      },
    ],
  },
  {
    ...getDialogItem({
      id: 6,
      resultProperty: "howAreYouDialog",
      dependsOnResultProperties: ["howAreYou"],
      dialogOptions: {
        howAreYou: {
          Good: [
            "Awesome!",
            "Great to hear.",
            "I found this old device",
            "I'm not really sure what it is, but...",
            "it looks like one from the history books",
            "I think they where called mobile phones",
            "My name is Aia",
          ],
          Bad: [
            "I didn't hear this in a while",
            "Usually, people are happy!",
            "My name is Aia",
          ],
        },
      },
      nextItemId: 7,
    }),
  },
  // PlayerName
  {
    id: 7,
    resultProperty: "playerName",
    dependsOnResultProperties: [],
    componentType: QuaireComponentType.INPUT,
    question: "Aia: What's your name?",
    description: "",
    required: true,
    inputOption: {
      nextItemId: 8,
    },
  },
  {
    ...getDialogItem({
      id: 8,
      resultProperty: "niceToMeetYouDialog",
      dialogOptions: [
        "Aia: Nice to meet you, <%= playerName %>!",
        "Aia: How can you read my messages?",
        "Aia: Do you also have one of those old mobile phone devices?",
      ],
      nextItemId: 9,
    }),
  },
  {
    id: 9,
    resultProperty: "whereDidYouFindTheMobile",
    dependsOnResultProperties: [],
    componentType: QuaireComponentType.SINGLE_SELECT,
    question: ">> I need to ask you something?",
    description: "",
    required: true,
    selectOptions: [
      {
        label: "Where did you find the mobile phone?",
        value: "Location",
        nextItemId: 100,
      },
      {
        label: "What model do you have?",
        value: "Brand",
        nextItemId: 200,
      },
      {
        label: "Why do you call it old?",
        value: "Age",
        nextItemId: 300,
      },
    ],
  },
];
