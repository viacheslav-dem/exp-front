import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-export-oriented-block',
    template: `
    <div class="form-sub-group">
        
      <label>
        {{num}}. Экспортная ориентированность инновационного проекта (превышение экспорта над импортом):
      </label>
        <div>
            <app-boolean-button class="d-inline-block"
                                [(ngModel)]="_form.isExportOriented"
                                [trueLabel]="'да'"
                                [falseLabel]="'нет'"
                                (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
        </div>
      <div *ngIf="full" class="hint">
      </div>
    </div>
  `
})
export class ExportOrientedBlockComponent {

    @Input()
    num: string = "2.5";

    @Input()
    full: boolean = true;

    @Input()
    _form: { isExportOriented: boolean };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
