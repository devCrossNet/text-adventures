import { MyItem } from "../MyQuaire";
import { getDialogItem } from "@/views/utils";

export const locationStoryLineItems: Array<MyItem> = [
  {
    ...getDialogItem({
      id: 100,
      resultProperty: "locationIntroDialog",
      dialogOptions: [
        "Aia: I found it...",
        "Aia: In the attic of my Grandpas house",
        "Aia: It was hidden in an old Box",
      ],
      nextItemId: 101,
    }),
  },
];
