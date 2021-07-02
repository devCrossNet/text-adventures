import { QuaireComponentType } from "quaire";
import { MyComponentType, MyItem } from "./MyQuaire";

export const items: Array<MyItem> = [
  {
    id: 1,
    resultProperty: "intro",
    dialogOptions: [
      "Hello??",
      "My name is Alivia.",
      "Alivia: I am trapped in the drunk of a car",
      "Alivia: My phone is broken and I am only able to text this number",
      "Alivia: Please let someone read my messages",
      "...",
      "..... .. .....",
      "Please answer if you received my messages",
      "Alivia: I need your help!",
    ],
    dependsOnResultProperties: [],
    componentType: MyComponentType.DIALOG,
    question: "",
    description: "",
    required: true,
    nextItemId: 2,
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
    dialogOptions: [
      "Alivia: OMG!!?",
      "Alivia: <%= playerName %>! I am so happy that you received my messages",
      "Alivia: Can you help me?",
    ],
    dependsOnResultProperties: [],
    componentType: MyComponentType.DIALOG,
    question: "",
    description: "",
    required: true,
    nextItemId: 4,
  },
];
