import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-software-tool-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие заявленному программному инструменту реализации:
      </label>
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form.softwareTool === 1}" (click)="stateButton(1)">
                Соответсвует
            </button>
            <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form.softwareTool === 2}" (click)="stateButton(2)">
                Не соотвествует
            </button>
            <button type="button" class="btn btn-outline-warning" [ngClass]="{'active': _form.softwareTool === 3}" (click)="stateButton(3)">
                Целесообразна реализация вне рамок программ
            </button>
        </div>
        <ng-container *ngIf="_form.softwareTool == 2">
            <label class="mt-2">Рекомендуемые программный инструмент:</label>
            <textarea [(ngModel)]="_form.softwareToolSuggestion" rows="2" class="form-control"
                      title="Рекомендуемый программный инструмент"
                      placeholder="Рекомендуемый программный инструмент"></textarea>
        </ng-container>
      <textarea *ngIf="full" [(ngModel)]="_form.softwareToolText" rows="3" class="form-control mt-05"
                [attr.placeholder]="isTextRequired ? 'Обязательный текст.' : 'Пояснительный текст (при необходимости).'"></textarea>
    </div>
    <div *ngIf="full" class="hint">
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
  `
})
export class SoftwareToolBlock2025Component {

    @Input()
    num: string = "10.6";

    @Input()
    full: boolean = true;

    @Input()
    isTextRequired: boolean = false;

    @Input()
    _form: { softwareTool: number, softwareToolSuggestion: string, softwareToolText: string };


    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(number: number) {
        if(number == 1){
            this._form.softwareTool = 1;
        } else if (number == 2){
            this._form.softwareTool = 2;
        } else if (number == 3){
            this._form.softwareTool = 3;
        }
    }

}