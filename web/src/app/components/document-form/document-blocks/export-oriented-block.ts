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
          [ngModel]="_form()?.isExportOriented"
          (ngModelChange)="emitPatch({ isExportOriented: $event })"
          [trueLabel]="'да'"
          [falseLabel]="'нет'"
        ></app-boolean-button>
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

    readonly _form = input<ExportOrientedBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ExportOrientedBlockForm>>();

    emitPatch(patch: Partial<ExportOrientedBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type ExportOrientedBlockForm = {
  isExportOriented: boolean;
};
