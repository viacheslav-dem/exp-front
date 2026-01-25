import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-work-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объемов выполняемых работ (оказываемых услуг),
        включая работы (услуги) по технической поддержке и сопровождению программно-технических средств,
        информационных ресурсов, информационных систем и информационных сетей, заявленным объемам финансирования:
      </label>
      <input type="hidden" [ngModel]="_form()?.workAccordance" name="workAccordance" required>
      <app-boolean-button name="workAccordance" required [ngModel]="_form()?.workAccordance"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
        (ngModelChange)="emitPatch({ workAccordance: $event })"></app-boolean-button>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.workAccordanceText"
          (ngModelChange)="emitPatch({ workAccordanceText: $event })"
          [attr.name]="'workAccordanceText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
        placeholder="Обязательный текст."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class WorkAccordanceBlockComponent {

  readonly num = input<string>("7");

  readonly full = input<boolean>(true);

  readonly _form = input<WorkAccordanceBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<WorkAccordanceBlockForm>>();

  emitPatch(patch: Partial<WorkAccordanceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type WorkAccordanceBlockForm = {
  workAccordance: boolean;
  workAccordanceText: string;
};
