import {Component, EventEmitter, Output, input} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {
    economicSignificanceOptions
} from "@app/components/document-form/document-blocks/economic-significance-block.component";

@Component({
    selector: 'app-economic-significance-8-8-block',
    template: `
        <div class="form-sub-group" xmlns="http://www.w3.org/1999/html">
          <label>
            {{num()}}. Экономическая и (или) социальная значимость (эффективность) объекта государственной экспертизы.
          </label>
          <label>
            Эффекты от инвестиций, которые потенциально смогут оказать воздействие на ускорение
            инновационного развития Республики Беларусь: <br>
          </label>
          <label>
            - открытие дочерних компаний и найм сотрудников в Республике Беларусь с фиксированием бюджета расходов такой компании:
          </label>
          <div>
            <app-boolean-button class="d-inline-block"
              [(ngModel)]="_form().isOpeningOfSubsidiaries"
              [trueLabel]="'да'"
              [falseLabel]="'нет'"
            (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
          </div>
          <br>
            <label>
              - участие в реализации государственных программ, инновационных и инвестиционных проектов,
              а также иных юридически значимых инициатив по развитию экономики Республики Беларусь как непосредственно,
              так и посредством поставок продукции (работ, услуг) исполнителям и другим участникам,
              в т.ч. путем содействия в осуществлении производства импортозамещающей
              для Республики Беларусь продукции (работ, услуг), организационно-технических решений:
            </label>
            <div>
              <app-boolean-button class="d-inline-block"
                [(ngModel)]="_form().isParticipationInnovationAndInvestment"
                [trueLabel]="'да'"
                [falseLabel]="'нет'"
              (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
            </div>
            <br>
              <label>
                - закупка материалов, комплектующих и услуг для обеспечения деятельности российской организации
                у резидентов в Республике Беларусь:
              </label>
              <div>
                <app-boolean-button class="d-inline-block"
                  [(ngModel)]="_form().isBuyMaterialSupplies"
                  [trueLabel]="'да'"
                  [falseLabel]="'нет'"
                (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
              </div>
              <br>
                <label>
                  - введение в гражданский оборот и (или) использование для собственных нужд организаций Республики Беларусь
                  объектов интеллектуальной собственности российских организаций или товаров (работ, услуг),
                  создаваемых (выполняемых, оказываемых) с их помощью, обеспечивающих достижение экономического и (или) социального эффектов:
                </label>
                <div>
                  <app-boolean-button class="d-inline-block"
                    [(ngModel)]="_form().isUseOfIntellectualProperty"
                    [trueLabel]="'да'"
                    [falseLabel]="'нет'"
                  (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
                </div>
                <br>
                  @if (full()) {
                    <div class="hint">
                      <p>
                        <b>Подсказка.</b>  При достижении одного и более эффектов:<br>
                        Внутренняя норма доходности равна или меньше ставки рефинансирования
                        Национального банка Республики Беларусь или динамический срок окупаемости инвестиций
                        по объекту государственной экспертизы больше 10 лет, – значимость низкая;
                      </p>
                      <label>
                        Внутренняя норма доходности превышает ставку рефинансирования Национального
                        банка Республики Беларусь до 10 процентных пунктов (включительно),
                        и динамический срок окупаемости инвестиций по объекту
                        государственной экспертизы до 10 лет (включительно), – значимость средняя;
                      </label>
                      <label>
                        Внутренняя норма доходности превышает ставку рефинансирования
                        Национального банка Республики Беларусь от 10 процентных
                        пунктов, и динамический срок окупаемости инвестиций по объекту государственной
                        экспертизы до 7 лет (включительно), – значимость высокая.
                      </label>
                    </div>
                  }
        
                  <label>
                    Значимость (экономическая и (или) социальная) потенциальная эффективность, которая должна быть достигнута по итогам
                    выполнения работ,
                    предусмотренных объектом государственной экспертизы:
                  </label>
                  <app-dropdown [options]="significanceOptions" [(ngModel)]="_form().economicSignificance"
                  (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
                  @if (full()) {
                    <textarea [(ngModel)]="_form().economicSignificanceText" rows="3" class="form-control mt-05"
                    placeholder="Обязательный текст"></textarea>
                  }
                  @if (full()) {
                    <div class="hint">
                      <p>
                        <b>Подсказка.</b>
                      </p>
                      <p class="mb-0">Оцените:</p>
                      <ul>
                        <li>
                          Не завышена ли прибыль (рентабельность) инвестиций;
                        </li>
                        <li>
                          Не занижены ли сроки окупаемости инвестиций;
                        </li>
                        <li>
                          Правильность расчета статей затрат;
                        </li>
                        <li>
                          Научно-техническую компетенцию для республики в результате инвестиций;
                        </li>
                        <li>
                          Не завышена (либо занижена) стоимость закупаемого оборудования;
                        </li>
                        <li>
                          Потребность республики в результатах инвестиций и эффекты,
                          которые потенциально смогут оказать воздействие на ускорение инновационного развития Республики Беларусь,
                          установленные в соответствии с договором инвестиционного товарищества «Российско-Белорусский фонд венчурных инвестиций».
                        </li>
                      </ul>
                    </div>
                  }
                </div>
        `,
    standalone: false
})
export class EconomicSignificance_8_8_BlockComponent {

    ProjectCodePlainDto = ProjectCodePlainDto;
    significanceOptions = economicSignificanceOptions;

    readonly num = input<string>("2");

    readonly full = input<boolean>(true);

    readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

    readonly _form = input<{
    economicSignificance: string;
    economicSignificanceText: string;
    isOpeningOfSubsidiaries: boolean;
    isParticipationInnovationAndInvestment: boolean;
    isBuyMaterialSupplies: boolean;
    isUseOfIntellectualProperty: boolean;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

