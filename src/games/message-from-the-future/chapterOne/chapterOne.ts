import { MyItem } from "../../../views/MyQuaire";
import { introItems } from "@/games/message-from-the-future/chapterOne/intro";
import { locationStoryLineItems } from "@/games/message-from-the-future/chapterOne/locationStoryLine";

export const chapterOneItems: Array<MyItem> = [
  ...introItems,
  ...locationStoryLineItems,
];
