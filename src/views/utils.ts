import { MyComponentType, MyItem } from "@/views/MyQuaire";

export const getDialogItem = (item: Partial<MyItem>): MyItem => ({
  id: 1,
  resultProperty: "",
  dialogOptions: [],
  dependsOnResultProperties: [],
  componentType: MyComponentType.DIALOG,
  question: "",
  description: "",
  required: true,
  ...item,
});
