import {
  Quaire,
  QuaireInputItemOption,
  QuaireItem,
  QuaireItemOption,
  QuaireQuestion,
  QuaireRangeItemOption,
} from "quaire";

export interface MyItem extends QuaireItem {
  isMonologue?: boolean;
  monologue?: Array<string>;
}

export interface MyQuestion extends QuaireQuestion {
  isMonologue?: boolean;
  monologue?: Array<string>;
}

export class MyQuaire extends Quaire<MyItem, MyQuestion> {
  protected _getQuestionObject(
    item: MyItem,
    dependsOnKeys: string[],
    selectOptions: QuaireItemOption[],
    rangeOption: QuaireRangeItemOption,
    inputOption: QuaireInputItemOption,
    defaultValue: any
  ): MyQuestion {
    return {
      ...super._getQuestionObject(
        item,
        dependsOnKeys,
        selectOptions,
        rangeOption,
        inputOption,
        defaultValue
      ),
      isMonologue: item.isMonologue,
      monologue: item.monologue,
    };
  }
}
