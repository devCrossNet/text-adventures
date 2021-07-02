import {
  Quaire,
  QuaireInputItemOption,
  QuaireItem,
  QuaireItemOption,
  QuaireQuestion,
  QuaireRangeItemOption,
} from "quaire";

export enum MyComponentType {
  DIALOG = "DIALOG",
}

export interface MyItem extends QuaireItem {
  dialogOptions?: Array<string>;
}

export interface MyQuestion extends QuaireQuestion {
  dialogOptions?: Array<string>;
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
      dialogOptions: item.dialogOptions,
    };
  }

  public saveAnswer(answer: any) {
    const activeQuestion = this.getActiveQuestion();
    if (activeQuestion?.componentType === MyComponentType.DIALOG) {
      this._result[activeQuestion.resultProperty] = answer;
      this._activeItemId = activeQuestion?.nextItemId || 1;
    } else {
      super.saveAnswer(answer);
    }
  }
}
