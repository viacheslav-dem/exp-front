import {ChangeDetectionStrategy, Component, OnInit, computed, effect, input, signal, output} from "@angular/core";
import {
  CheckboxField,
  MultiCheck,
  MultiCheckField,
  MultiSelectField,
  SearchField,
  SearchFieldType
} from "app/components/common-components/page-and-filter/model/SearchField";
import {Direction, switchDirection} from "app/components/common-components/page-and-filter/model/SortOrder";
import {Filter} from "app/components/common-components/page-and-filter/model/Filter";
import {DataService} from "@app/services/data.service";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styles: [`
      .form-label {
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
      }
      
      .form-control {
        transition: all 0.3s ease;
        border-width: 1px;
      }
      
      .form-control:focus {
        border-color: #86b7fe;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        outline: 0;
      }
      
      .input-group-text {
        transition: all 0.3s ease;
      }
      
      .input-group-text:hover {
        background-color: #e9ecef;
      }
      
      .btn-outline-primary {
        transition: all 0.3s ease;
      }
      
      .btn-outline-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 0.25rem 0.5rem rgba(13, 110, 253, 0.2);
      }
      
      .btn-outline-primary.active {
        background-color: #0d6efd;
        border-color: #0d6efd;
        color: #fff;
      }
      
      .btn-primary {
        transition: all 0.3s ease;
      }
      
      .btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 0.25rem 0.5rem rgba(13, 110, 253, 0.3);
      }
      
      .btn-outline-secondary {
        transition: all 0.3s ease;
      }
      
      .btn-outline-secondary:hover {
        transform: translateY(-1px);
        box-shadow: 0 0.25rem 0.5rem rgba(108, 117, 125, 0.2);
      }
    `],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.listsAndFilters)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class FilterComponent implements OnInit {

  SearchFieldType = SearchFieldType;
  searcherTimer: any;
  _fields: SearchField[] = [];
  readonly maxTitleLength = 400;
  
  // Сигнал для реактивного обновления полей фильтров
  private _fieldsSignal = signal<SearchField[]>([]);
  
  // Computed для использования в шаблоне - автоматически обновляется при изменении сигнала
  fieldsForTemplate = computed(() => this._fieldsSignal());
  
  readonly fieldClass = input<string>('');
  readonly filterClass = input<string>('');
  readonly onFilterChanged = output<Filter<any>[]>();

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit() {
  }

  /**
   * Title для ng-select (и подобных контролов):
   * - если есть выбранные значения — показываем их полностью
   * - иначе — показываем текст плейсхолдера/название поля
   */
  getFieldTitle(field: SearchField): string {
    if (!field) {
      return '';
    }

    if (field.type === SearchFieldType.MULTI_SELECT) {
      const ms = field as unknown as MultiSelectField;
      const selected = (ms?.selectedItems ?? [])
        .map((x: any) => x?.itemName)
        .filter(Boolean) as string[];

      // Важно: если ничего не выбрано, НЕ показываем в title текст типа
      // "область компетенции" — пользователь ожидает видеть названия выбранных элементов.
      const text = selected.length > 0 ? selected.join(', ') : '';

      return this.truncateTitle(text);
    }

    // Для текстовых/прочих — если есть значение, используем его, иначе placeholder/title
    const raw =
      (typeof field.value === 'string' ? field.value : '') ||
      field.placeholder ||
      field.title ||
      '';

    return this.truncateTitle(raw);
  }

  private truncateTitle(text: string): string {
    const s = (text ?? '').toString().trim();
    if (!s) {
      return '';
    }
    if (s.length <= this.maxTitleLength) {
      return s;
    }
    return s.slice(0, this.maxTitleLength - 1) + '…';
  }

  readonly fields = input<SearchField[]>(undefined);

  private readonly fieldsEffect = effect(() => {
    const fields = this.fields();
    if (!fields) {
      return;
    }
    this._fields = fields;
    // Обновляем сигнал при изменении полей - это триггерит реактивное обновление
    this._fieldsSignal.set([...fields]);
    
    this._fields.forEach(field => {
      if ((field.type == SearchFieldType.MULTI_SELECT) && field.catalog != null)
        this.dataService.getCatalog(field.catalog).subscribe(items => {
          const multiSelectField = <MultiSelectField>field;
          multiSelectField.setItems(items);
          // Если поле уже имеет значение (из кэша), обновляем selectedItems
          if (multiSelectField.value && Array.isArray(multiSelectField.value) && multiSelectField.value.length > 0) {
            multiSelectField.setSelectedValues(multiSelectField.value);
          }
          // Обновляем сигнал после загрузки каталога для реактивного обновления
          this._fieldsSignal.set([...this._fields]);
        });
    });
  });

  filterChanged() {
    this.onFilterChanged.emit(this._fields);
  }

  // Обработчик изменения текстового поля через ngModel
  onTextValueChange(field: SearchField) {
    // Обновляем сигнал для реактивного обновления UI
    this._fieldsSignal.set([...this._fields]);
    clearTimeout(this.searcherTimer);
    this.searcherTimer = setTimeout(() => this.filterChanged(), 6000);
  }

  // Старый метод оставлен для обратной совместимости, если где-то используется
  changeSearchText($event: any, field: SearchField) {
    const newValue = $event.srcElement.value;
    field.value = newValue;
    this.onTextValueChange(field);
  }

  changePeriod($event, field: SearchField, type: 'start' | 'end') {
    field.value[type] = Number.parseInt($event.srcElement.value);
    // Обновляем сигнал для реактивного обновления UI
    this._fieldsSignal.set([...this._fields]);
    clearTimeout(this.searcherTimer);
    this.searcherTimer = setTimeout(() => this.filterChanged(), 6000);
  }

  changeMultiCheck(field: MultiCheckField, multiCheck: MultiCheck) {
    field.check(multiCheck);
    // Обновляем сигнал для реактивного обновления UI
    this._fieldsSignal.set([...this._fields]);
    this.filterChanged();
  }

  changeCheckbox(field: CheckboxField) {
    field.checked = !field.checked;
    // Обновляем сигнал для реактивного обновления UI
    this._fieldsSignal.set([...this._fields]);
    this.filterChanged();
  }

  changeMultiSelect(field: MultiSelectField) {
    field.selectChanged();
    // Обновляем сигнал для реактивного обновления UI
    this._fieldsSignal.set([...this._fields]);
    this.filterChanged();
  }

  sortBy(field: SearchField) {
    field.sortDirection = switchDirection(field.sortDirection);
    this._fields.forEach(f => {
      if (field != f && !f.multipleSorting) {
        f.sortDirection = null;
      }
    });
    // Обновляем сигнал для реактивного обновления UI
    this._fieldsSignal.set([...this._fields]);
    this.filterChanged();
  }

  reset(field: SearchField) {
    field.reset();
    // Обновляем сигнал для реактивного обновления UI
    this._fieldsSignal.set([...this._fields]);
    this.filterChanged();
  }

  sortIconClass(field: SearchField) {
    return field.sortDirection == Direction.ASC ? 'sort-amount-up' :
      field.sortDirection == Direction.DESC ? 'sort-amount-down' : 'sort';
  }
}
