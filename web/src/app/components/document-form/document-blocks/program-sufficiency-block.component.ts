import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-program-sufficiency-block',
    template: `
        <div class="form-sub-group">
          <label>
            {{ num() }}. Достаточность перечня мероприятий по научному обеспечению государственной программы / перечня
            заданий
            государственной научно-технической программы для достижения запланированных программой целевых
            показателей:
          </label>
          <app-boolean-button name="programSufficiency" required [ngModel]="_form()?.programSufficiency" [trueLabel]="'достаточен'"
            [falseLabel]="'недостаточен'"
          (ngModelChange)="emitPatch({ programSufficiency: $event })"></app-boolean-button>
          @if (full()) {
            <textarea
              [ngModel]="_form()?.programSufficiencyText"
              (ngModelChange)="emitPatch({ programSufficiencyText: $event })"
              [attr.name]="'programSufficiencyText_' + num().split('.').join('_')"
              required
              minlength="30"
              maxlength="5000"
              rows="3"
              class="form-control mt-05"
            placeholder="Обязательный текст"></textarea>
          }
          @if (full()) {
            <div class="hint">
              <p>
                <b>Подсказка.</b>
                Рассматриваются перечень мероприятий по научному обеспечению (для государственной программы (за
                исключением государственной программы в сфере цифрового развития), в рамках которых
                предусматривается реализация мероприятий в сферах научной, научно-технической и инновационной
                деятельности) / заданий (для государственной научно-технической программы), их научно-технический
                уровень, объемы финансирования, в том числе с учетом целевых показателей программы.
              </p>
              <p>
                Оценивается достаточность / недостаточность перечня мероприятий по научному обеспечению (для
                государственной программы (за исключением государственной программы в сфере цифрового развития), в
                рамках которых предусматривается реализация мероприятий в сферах научной, научно-технической и
                инновационной деятельности) / перечня заданий (для государственной научно-технической программы) для
                достижения запланированных программой целевых показателей. При формировании перечня мероприятий по
                научному обеспечению (для государственной программы, за исключением государственной программы в
                сфере цифрового развития), в рамках которых предусматривается реализация мероприятий в сферах
                научной, научно-технической и инновационной деятельности) / заданий (для государственной
                научно-технической программы) в отрыве от цели и задач программ или включении в перечень мероприятий
                по научному обеспечению (для государственной программы (за исключением государственной программы в
                сфере цифрового развития), в рамках которых предусматривается реализация мероприятий в сферах
                научной, научно-технической и инновационной деятельности) прикладных научных исследований и
                разработок, результаты которых предполагают создание товаров (в том числе, при отсутствии выпуска
                вновь освоенной продукции), реализация таких мероприятий рекомендуется в рамках научно-технических
                программ.
              </p>
            </div>
          }
        
        </div>
        `,
    standalone: false
})
export class ProgramSufficiencyBlockComponent {

    readonly num = input<string>("4");

    readonly full = input<boolean>(true);

    readonly _form = input<ProgramSufficiencyBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ProgramSufficiencyBlockForm>>();

    emitPatch(patch: Partial<ProgramSufficiencyBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type ProgramSufficiencyBlockForm = {
  programSufficiency: boolean;
  programSufficiencyText: string;
};
