import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { Catalog, DataService } from 'app/services/data.service';
import { CatalogTemplate } from '@app/components/data-management/catalog/CatalogTemplate';
import { DirectionDto } from '@app/dto/DirectionDto';
import { GlobalToastyService } from '@app/services/global-toasty.service';
import { SearchField } from '@app/components/common-components/page-and-filter/model/SearchField';
import { Direction } from '@app/components/common-components/page-and-filter/model/SortOrder';
import { SubDirectionDto } from '@app/dto/SubDirectionDto';
import { createTrackKeyStore, isEmptyOrNull } from '@app/support/utils';
import { CommonComponentsModule } from '@app/components/common-components/components.module';
import { CustomPipesModule } from '@app/pipes/custom-pipes.module';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
  standalone: true,
  imports: [CommonComponentsModule, CustomPipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectionsComponent<T extends DirectionDto> extends CatalogTemplate<T> {
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    super(inject(GlobalToastyService), inject(DataService));
  }

  override _type = Catalog.DIRECTION;

  readonly subDirInput = signal('');
  readonly subDirError = signal<string | null>(null);

  private readonly subDirInputEl = viewChild<ElementRef<HTMLInputElement>>('subDirInputEl');

  // Стабильные trackKey без мутации DTO (WeakMap).
  private readonly _directionTrackKey = createTrackKeyStore<DirectionDto>('direction:');
  private readonly _subDirTrackKey = createTrackKeyStore<SubDirectionDto>('sub-direction:');

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('name').setSortDirection(Direction.ASC)
          .setPlaceholder('Поиск по наименованию...').setSortable(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
    this.enableFilterCache('directions');
    setTimeout(() => {
      const hasCachedFilters = localStorage.getItem('filter_cache_directions');
      if (!hasCachedFilters) {
        this.update();
      }
    }, 100);
  }

  // saveEditedItem() {
  //   this._dataService.saveDirection(this.editedItem).subscribe(() => {
  //     this._toasty.success("Сохранено.");
  //     this.update();
  //   });
  // }

  create(): T {
    return <T>new DirectionDto();
  }

  onSubDirInputChange(value: string): void {
    this.subDirInput.set(value);
    if (this.subDirError()) {
      this.subDirError.set(null);
    }
  }

  onSubDirInputEnter(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.addSubDir();
  }

  private focusSubDirInput(): void {
    // После добавления удобно сразу вводить следующее значение.
    queueMicrotask(() => this.subDirInputEl()?.nativeElement?.focus());
  }

  addSubDir(): void {
    const value = ((this.subDirInput() ?? '').trim().replace(/\s+/g, ' '));
    if (isEmptyOrNull(value)) {
      this.subDirError.set('Введите поднаправление.');
      return;
    }

    if (!this.editedItem) {
      this._toasty.error('Нельзя добавить направление: запись не выбрана для редактирования.');
      return;
    }

    const exists = (this.editedItem.subDirectionDtos ?? []).some(
      (sd) => (sd?.directionName ?? '').trim().toLowerCase() === value.toLowerCase()
    );
    if (exists) {
      this.subDirError.set('Такое поднаправление уже добавлено.');
      return;
    }

    const sdDto = new SubDirectionDto() as SubDirectionDto & { id: number | null };
    sdDto.id = null;
    sdDto.directionName = value;

    this.editedItem.subDirectionDtos = [sdDto, ...(this.editedItem.subDirectionDtos ?? [])];
    this.subDirInput.set('');
    this.subDirError.set(null);
    this.cdr.markForCheck();
    this.focusSubDirInput();
  }

  directionTrackKey(item: DirectionDto): string | number {
    // id=0 — локальная несохранённая запись
    if (item?.id && item.id !== 0) {
      return item.id;
    }
    return this._directionTrackKey(item);
  }

  subDirTrackKey(item: SubDirectionDto): string | number {
    // id может отсутствовать/быть 0 для новой записи
    if ((item as any)?.id && (item as any).id !== 0) {
      return (item as any).id;
    }
    return this._subDirTrackKey(item);
  }

  isNewSubDir(item: SubDirectionDto): boolean {
    // Для существующих поднаправлений удаление может быть запрещено на бэке (используются в проектах/связях).
    // Показываем кнопку удаления только для "локально добавленных" (id ещё нет или id == 0).
    return !item?.id;
  }

  removeSubDir(index: number): void {
    if (!this.editedItem) return;
    const list = this.editedItem.subDirectionDtos ?? [];
    if (index < 0 || index >= list.length) return;
    this.editedItem.subDirectionDtos = list.filter((_, i) => i !== index);
    this.cdr.markForCheck();
  }

  override cancelEditItem(): void {
    const item = this.selectedItem;
    if (item?.id === 0 && this.items) {
      const idx = this.items.indexOf(item);
      if (idx >= 0) this.items.splice(idx, 1);
      this.subDirInput.set('');
      this.cdr.markForCheck();
    }
    super.cancelEditItem();
  }
}

