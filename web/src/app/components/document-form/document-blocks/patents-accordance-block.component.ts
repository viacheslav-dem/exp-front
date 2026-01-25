import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-patents-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие объекта экспертизы критерию, указанному в абзаце 2 пункта 2 Положения о порядке
        формирования перечня инновационных товаров, утвержденного постановлением Совета Министров Республики Беларусь от
        31 октября 2012 г. № 995 (использование способных к правовой охране результатов интеллектуальной деятельности):
      </label>
      <app-boolean-button
        name="patents"
        required
        [(ngModel)]="_form().patents"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().patentsText" (ngModelChange)="onConditionsChanged.emit(true)" name="patentsText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class PatentsAccordanceBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    patents: boolean;
    patentsText: string;
}>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
