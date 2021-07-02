import { MyItem } from "../MyQuaire";
import { introItems } from "@/views/chapterOne/intro";
import { locationStoryLineItems } from "@/views/chapterOne/locationStoryLine";

export const chapterOneItems: Array<MyItem> = [
  ...introItems,
  ...locationStoryLineItems,
];
