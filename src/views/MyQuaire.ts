import _get from "lodash.get";
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

export interface DialogOption {
  [key: string]: unknown | Array<string>;
}

export interface MyItem extends QuaireItem {
  dialogOptions?: Array<string> | DialogOption;
}

export interface MyQuestion extends QuaireQuestion {
  dialogOptions?: Array<string> | DialogOption;
}

export class MyQuaire extends Quaire<MyItem, MyQuestion> {
  protected _getDialogOptions(item: MyItem): Array<string> {
    if (item.dependsOnResultProperties.length > 0) {
      const path = this._getDependencyPath(item);
      return _get(item.dialogOptions, path, null);
    } else if (item?.dialogOptions) {
      return Array.from(item.dialogOptions as Array<string>);
    }
    return [];
  }

  protected _getQuestionObject(
    item: MyItem,
    dependsOnKeys: string[],
    selectOptions: QuaireItemOption[],
    rangeOption: QuaireRangeItemOption,
    inputOption: QuaireInputItemOption,
    defaultValue: unknown
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
      dialogOptions: this._getDialogOptions(item),
    };
  }

  public saveAnswer(answer: unknown): void {
    const activeQuestion = this.getActiveQuestion();
    if (activeQuestion?.componentType === MyComponentType.DIALOG) {
      this._result[activeQuestion.resultProperty] = answer;
      this._activeItemId = activeQuestion?.nextItemId || 1;
    } else {
      super.saveAnswer(answer);
    }
  }
}
