import { QuaireComponentType } from "quaire";
import { MyItem } from "./MyQuaire";

export const items: Array<MyItem> = [
  {
    id: 1,
    resultProperty: "intro",
    isMonologue: true,
    monologue: [
      "Hello??",
      "My name is Alivia.",
      "I am trapped in the drunk of a car",
      "My phone is broken and I am only able to text this number",
      "Please let someone read my messages",
      "...",
      "..... .. .....",
      "Please answer if you received my messages",
      "I need your help!",
    ],
    dependsOnResultProperties: [],
    componentType: QuaireComponentType.INPUT,
    question: "",
    description: "",
    required: true,
    defaultValue: true,
    inputOption: {
      type: "text",
      placeholder: "Type your name",
      nextItemId: 2,
    },
  },
  {
    id: 2,
    resultProperty: "playerName",
    dependsOnResultProperties: [],
    componentType: QuaireComponentType.INPUT,
    question: "Hello Alivia! My name is",
    description: "",
    required: true,
    inputOption: {
      type: "text",
      placeholder: "Type your name",
      nextItemId: 3,
    },
  },
  {
    id: 3,
    resultProperty: "intro2",
    isMonologue: true,
    monologue: [
      "OMG!!?",
      "<%= playerName %>!, I am so happy that you received my messages",
      "Can you help me?",
    ],
    dependsOnResultProperties: [],
    componentType: QuaireComponentType.INPUT,
    question: "",
    description: "",
    required: true,
    defaultValue: true,
    nextItemId: 4,
  },
];
