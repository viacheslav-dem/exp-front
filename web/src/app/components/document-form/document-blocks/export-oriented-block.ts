import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-export-oriented-block',
    template: `
    <div class="form-sub-group">
    
      <label>
        {{num()}}. Экспортная ориентированность инновационного проекта (превышение экспорта над импортом):
      </label>
      <div>
        <app-boolean-button class="d-inline-block"
          [(ngModel)]="_form().isExportOriented"
          [trueLabel]="'да'"
          [falseLabel]="'нет'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      </div>
      @if (full()) {
        <div class="hint">
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ExportOrientedBlockComponent {

    readonly num = input<string>("2.5");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    isExportOriented: boolean;
}>(undefined);

    readonly onConditionsChanged = output<boolean>();
}
