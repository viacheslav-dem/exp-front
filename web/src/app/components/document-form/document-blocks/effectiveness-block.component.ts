import {Component, input} from '@angular/core';

@Component({
    selector: 'app-effectiveness-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка результатов научной и (или) научно-технической и (или) инновационной деятельности в
        соответствии с методическими рекомендациями по оценке эффективности научных, научно-технических и инновационных
        разработок и их внедрения, утвержденными постановлением Государственного комитета по науке и технологиям
        Республики Беларусь от 20 апреля 2017 г. № 9.
      </label>
      <textarea [(ngModel)]="_form().effectiveness" rows="3" class="form-control"
                placeholder="Обязательный текст."></textarea>
    </div>
  `,
    standalone: false
})
export class EffectivenessBlockComponent {

  readonly num = input<string>("2");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    effectiveness: string;
}>(undefined);
}
