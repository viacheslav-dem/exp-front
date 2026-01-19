import {Component, input, output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-software-tool-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие заявленному программному инструменту реализации:
      </label>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().softwareTool === 1}" (click)="stateButton(1)">
          Соответствует
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().softwareTool === 2}" (click)="stateButton(2)">
          Не соответствует
        </button>
        <button type="button" class="btn btn-outline-warning" [ngClass]="{'active': _form().softwareTool === 3}" (click)="stateButton(3)">
          Целесообразна реализация вне рамок программ
        </button>
      </div>
      @if (_form().softwareTool == 2) {
        <label class="mt-2">Рекомендуемые программный инструмент:</label>
        <textarea [(ngModel)]="_form().softwareToolSuggestion" rows="2" class="form-control"
          title="Рекомендуемый программный инструмент"
        placeholder="Рекомендуемый программный инструмент"></textarea>
      }
      @if (full()) {
        <textarea [(ngModel)]="_form().softwareToolText" name="softwareToolText" [required]="isTextRequired()" minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
    </div>
    @if (full()) {
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          Решение о соответствии заявленному программному инструменту реализации принимается при соответствии следующей схеме выполнения
          научных исследований и разработок:
          <p> - фундаментальные научные исследования - в государственных программах научных исследований (для проектов заданий государственных
            программ научных исследований);
          </p>
          <p> - прикладные научные исследования и разработки - в рамках научно-технических программ (для проектов заданий государственных программ
            научных исследований, научные исследования по которым носят прикладной характер).
          </p>
        </div>
      }
    `,
    standalone: false
})
export class SoftwareToolBlock2025Component {

    readonly num = input<string>("10.6");

    readonly full = input<boolean>(true);

    readonly isTextRequired = input<boolean>(false);

    readonly _form = input<{
    softwareTool: number;
    softwareToolSuggestion: string;
    softwareToolText: string;
}>(undefined);


    readonly onConditionsChanged = output<boolean>();

    stateButton(number: number) {
        if(number == 1){
            this._form().softwareTool = 1;
        } else if (number == 2){
            this._form().softwareTool = 2;
        } else if (number == 3){
            this._form().softwareTool = 3;
        }
    }

}
