import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-scientific-level-ex-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Научно-технический уровень внедряемой технологии по сравнению с передовыми технологиями,
        используемыми в мире, и возможность ее применения на соответствующем производстве.
      </label>
      <textarea
        [ngModel]="_form()?.scientificLevel"
        (ngModelChange)="emitPatch({ scientificLevel: $event })"
        [attr.name]="'scientificLevelEx_' + num().split('.').join('_')"
        required
        minlength="30"
        rows="3"
        class="form-control"
        placeholder="Обязательный текст (не менее 30 символов)."
      ></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
          </p>
          <p class="mb-0">Укажите:</p>
          <ul>
            <li>краткую характеристику научно-технического уровня предлагаемой инвестиционным проектом технологии;</li>
            <li>информацию о проведенных маркетинговых и патентных исследованиях и их результатах;</li>
            <li>срок появления технологии на рынке и ее обновление;</li>
            <li>обоснованность выбора основного технологического оборудования;</li>
            <li>
              результаты сравнения привлекаемых (создаваемых) технологий по ключевым функциональным характеристикам
              (энергоемкость, материалоемкость, уровень импортозависимости и т.д.) с передовыми технологиями,
              используемыми в мире;
            </li>
            <li>информацию об уровне технологического уклада на действующем производстве;</li>
            <li>
              обоснованность достижения планируемого уровня технологического уклада с учетом располагаемого инициатором
              и предложенного в бизнес-плане инвестиционного проекта основного технологического оборудования
              и его поставщиков, сроков ввода объекта в эксплуатацию;
            </li>
            <li>оценку возможных рисков, связанных с внедрением предлагаемой технологии;</li>
            <li>
              оценку уровня качества реконструируемого (создаваемого) производства, прогнозы по обеспечению выпуска
              продукции в соответствии с требованиями ISO, OHSAS, AS, иными международными стандартами.
            </li>
          </ul>
          <p>
            Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
            или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ScientificLevelExBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<ScientificLevelExBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<ScientificLevelExBlockForm>>();

  emitPatch(patch: Partial<ScientificLevelExBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type ScientificLevelExBlockForm = {
  scientificLevel: string;
};
