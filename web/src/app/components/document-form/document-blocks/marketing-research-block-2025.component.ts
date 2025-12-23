import {Component, EventEmitter, Output, input} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Component({
    selector: 'app-marketing-research-block-2025',
    template: `
        <div class="form-sub-group">
          <label>
            {{ num() }}. Проведение маркетинговых и патентных исследований, их результаты:
          </label>
          <app-dropdown name="marketingResearch" required [options]="marketingResearchOptions" [(ngModel)]="_form().marketingResearch"
          (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
          @if (full()) {
            <textarea
              [(ngModel)]="_form().marketingResearchText"
              [attr.name]="'marketingResearchText_' + num().split('.').join('_')"
              required
              minlength="30"
              rows="3"
              class="form-control mt-05"
              placeholder="Обязательный текст (не менее 30 символов)."
            ></textarea>
          }
          @if (full()) {
            <div class="hint">
              <p>
                <b>Подсказка.</b>
                Если в материалах по объекту государственной экспертизы отсутствует соответствующая информация,
                эксперт должен указать: «Не представлено в материалах по объекту государственной экспертизы».
              </p>
              @if (!isExpertReview()) {
                <div>
                  <p>
                    Оценивается наличие конкретных потребителей (возможности переориентации на альтернативные
                    рынки), заинтересованных в приобретении создаваемой в результате реализации инвестиционного
                    проекта продукции, в количестве, достаточном для обеспечения прогнозируемого уровня
                    использования проектной мощности; полноту и качество проведенных маркетинговых исследований
                    рынков сбыта намечаемой к выпуску продукции с учетом прогнозируемых тенденций развития этих
                    рынков, обоснованность цен на нее и указываются результаты проведения маркетинговых и патентных
                    исследований по объекту государственной экспертизы.
                  </p>
                </div>
              }
              @if (this.project().code.expertReviewType == 'EXPERT_REVIEW_8_3_4_12NIOKTR_2025') {
                <div>
                  <p>
                    Для объектов государственной экспертизы, указанных в подпункте 8.4 пункта 8 Положения,
                    дополнительно оценивается наличие:
                  </p>
                  <ul>
                    <li>
                      конкретных потребителей, заинтересованных в практическом использовании результатов
                      исследований и разработок,
                      полученных при реализации проекта (для всех типов проектов) – наличие письменных
                      обязательств государственного
                      заказчика и/или других заинтересованных;
                    </li>
                    <li>
                      информации об основных социальных и технико-экономических параметрах планируемых новшеств,
                      включая сравнение показателей
                      объекта с характеристиками лучших отечественных и зарубежных аналогов, с указанием
                      ориентировочной себестоимости
                      и цены новой продукции на момент подачи (себестоимость аналогичной продукции должна быть
                      ниже ее рыночной цены);
                      запланированный объем выпуска продукции (общий и по годам) в натуральном и денежном
                      выражении,
                      c указанием организации(й)-изготовителя(ей); является ли продукция импортозамещающей и (или)
                      экспортоориентированной.
                      Кроме того, наличие информации о том, планируется ли в рамках реализации проекта создать
                      новое производство
                      или модернизировать действующее с указанием сведений о создаваемом/модернизируемом
                      производстве (наименование, мощность и другое).
                    </li>
                  </ul>
                </div>
              }
            </div>
          }
        </div>
        `,
    standalone: false
})
export class MarketingResearchBlock2025Component {

    marketingResearchOptions: string[] = [
        'имеются',
        'не имеются',
    ];

    readonly num = input<string>("6");

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly full = input<boolean>(true);

    readonly _form = input<{
    marketingResearch: string;
    marketingResearchText: string;
}>(undefined);

    readonly isExpertReview = input<boolean>(true);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}