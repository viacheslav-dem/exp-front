import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";

@Component({
    selector: 'app-economic-significance-bif-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Значимость (экономическая и (или) социальная), которая должна быть достигнута по итогам выполнения работ,
        предусмотренных объектом государственной экспертизы:
      </label>
      <app-dropdown [options]="significanceOptions" [(ngModel)]="_form.economicSignificance"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.economicSignificanceText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
        <div *ngIf="full" class="hint">
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
                    Потребность республики в результатах,
                    получение которых запланировано в ходе реализации объекта экспертизы,
                    в тои числе с учетом возможностей расширения экспорта и (или) сокращения импорта продукции.
                </li>
            </ul>
            <p>
                На основании данных о внутренней норме доходности из таблицы «Сводные показатели по проекту» бизнес-плана:
                Внутренняя норма доходности равна или меньше ставки рефинансирования Национального банка Республики Беларусь или динамический 
                срок окупаемости инвестиций по объекту государственной экспертизы больше 10 лет, – значимость низкая;
            </p>
            <p>
                Внутренняя норма доходности превышает ставку рефинансирования Национального банка Республики Беларусь до 10 процентных пунктов (включительно),
                и динамический срок окупаемости инвестиций по объекту государственной экспертизы до 10 лет (включительно), – значимость средняя;
            </p>
            <p>
                Внутренняя норма доходности превышает ставку рефинансирования Национального банка Республики Беларусь от 10 процентных пунктов,
                и динамический срок окупаемости инвестиций по объекту государственной экспертизы до 7 лет (включительно), – значимость высокая.
            </p>
            
        </div>
    </div>
  `,
    standalone: false
})
export class EconomicSignificance88BIFBlockComponent {

    ProjectCodePlainDto = ProjectCodePlainDto;
    significanceOptions = economicSignificanceOptions;

    @Input()
    num: string = "2";

    @Input()
    full: boolean = true;

    @Input()
    project: ProjectPlainDto | ProjectDto;

    @Input()
    _form: { economicSignificance: string, economicSignificanceText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}

export const economicSignificanceOptions: string[] = [
    'низкая',
    'средняя',
    'высокая'
];
