import {ChangeDetectionStrategy, ChangeDetectorRef, Component, signal, computed, inject, DestroyRef, viewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GlobalToastyService} from "app/services/global-toasty.service";
import {compareByField, createTrackKeyStore, sortPersonsByName} from "app/support/utils";
import {Catalog, DataService} from "@app/services/data.service";
import {BureauDto} from "@app/dto/BureauDto";
import {CouncilDto} from "@app/dto/CouncilDto";
import {PersonDto} from "@app/dto/PersonDto";
import {SectionDto} from "@app/dto/SectionDto";
import {getAllSectionTypes, SectionTypePipe} from "@app/pipes/section-type.pipe";
import {CouncilPipe} from "@app/pipes/council.pipe";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {CatalogDto} from "@app/dto/CatalogDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {Filter} from "@app/components/common-components/page-and-filter/model/Filter";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {SearchPersonComponent} from "@app/components/search/search-person/search-person.component";
import {environment} from "../../../../environments/environment";
import {catchError, of} from "rxjs";

@Component({
    selector: 'app-councils',
    templateUrl: './councils.component.html',
    styleUrls: ['./councils.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dataManagement) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class CouncilsComponent extends FilterAndPages<CouncilDto> {
  Catalog = Catalog;

  allSectionTypes: string[] = getAllSectionTypes();

  private readonly _trackKey = createTrackKeyStore<object>('councils:');

  // Современные Angular 21 практики: используем inject() вместо constructor injection
  private readonly _toasty = inject(GlobalToastyService);
  private readonly _dataService = inject(DataService);
  private readonly _sectionTypePipe = inject(SectionTypePipe);
  private readonly _councilPipe = inject(CouncilPipe);
  private readonly cdr = inject(ChangeDetectorRef);

  // Signals для реактивного состояния
  readonly councils = signal<CouncilDto[]>([]);
  readonly selectedCouncil = signal<CouncilDto | null>(null);
  readonly selectedBureau = signal<BureauDto | null>(null);
  readonly selectedSection = signal<SectionDto | null>(null);
  
  // Состояние для редактирования
  editedCouncil: CouncilDto | null = null;
  editedBureau: BureauDto | null = null;
  editedSection: SectionDto | null = null;
  
  // Состояние для модальных окон
  onPersonSelected: ((person: PersonPlainDto) => void) | null = null;
  readonly searchPersonFilter = signal<Filter<PersonPlainDto> | null>(null);
  
  // Другие свойства
  readonly sectionTypeToString = (value: string) => this._sectionTypePipe.transform(value);
  newDirection: CatalogDto | null = null;
  
  // Signal для belisa (загружается асинхронно)
  readonly belisa = toSignal(
    this._dataService.getBelisa().pipe(
      catchError(() => {
        console.error('Ошибка загрузки данных БелИСА');
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: null as IdNameDto | null }
  );

  // Computed для проверки возможности добавления секции
  readonly canAddSection = computed(() => {
    const council = this.selectedCouncil();
    return council !== null && council.id !== 0;
  });

  // Сигналы для управления вкладками
  readonly activeTab = signal<'main' | 'bureau' | 'sections'>('main');
  readonly activeSectionIndex = signal<number | null>(null);

  /**
   * Важно для zoneless + signals:
   * мы часто мутируем DTO (council.isEdit = true и т.п.), а computed зависит от signal-ссылок.
   * Чтобы computed/шаблон гарантированно обновлялись, используем "тик" сигнал,
   * который дергаем при смене UI-режимов (edit/cancel и т.п.).
   */
  private readonly _uiStateTick = signal(0);
  private bumpUiStateTick() {
    this._uiStateTick.update(v => v + 1);
    // markForCheck не нужен: _uiStateTick используется в computed hasUnsavedChanges, который автоматически триггерит change detection
  }
  
  // Computed: есть ли несохранённые изменения
  readonly hasUnsavedChanges = computed(() => {
    // зависимость для реактивности при мутациях DTO
    this._uiStateTick();
    const council = this.selectedCouncil();
    const bureau = this.selectedBureau();
    return council?.isEdit || bureau?.isEdit || 
           council?.sections?.some(s => s.isEdit) || false;
  });

  public readonly searchPersonModal = viewChild(SearchPersonComponent);

  constructor() {
    super();
  }

  /**
   * Стабильный track-ключ для councils:
   * - id с бэка
   * - иначе clientId/trackKey из WeakMap (без мутации объекта)
   *
   * Вынесено в TS, чтобы не ломать строгую типизацию шаблонов.
   */
  trackCouncil(council: CouncilDto): number | string {
    return council.id || this._trackKey(council);
  }

  /**
   * Стабильный track-ключ для sections:
   * - id с бэка
   * - иначе clientId/trackKey из WeakMap (без мутации объекта)
   */
  trackSection(section: SectionDto): number | string {
    return section.id || this._trackKey(section);
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('name').setPlaceholder('Поиск по наименованию...').setSortable(true),
      SearchField.equals('code').setPlaceholder('Поиск по коду...')
        .setSortDirection(Direction.ASC).setSortable(true),
      SearchField.multiSelect("directions", Catalog.DIRECTION)
        .setSelectText("Приоритетные направления")
        .setSearchFilterEnabled(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
    this.enableFilterCache("councils");
    // Если нет сохранённого состояния фильтров, загружаем данные явно
    // Используем requestAnimationFrame вместо setTimeout для лучшей производительности
    requestAnimationFrame(() => {
      const hasCachedFilters = localStorage.getItem('filter_cache_councils');
      if (!hasCachedFilters) {
        this.update();
      }
    });
  }

  loadPage() {
    this._dataService.getCouncilsAdminPage(this._searchRequest).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error('Ошибка загрузки данных советов:', error);
        this._toasty.error("Ошибка загрузки данных.");
        this.setLoading(false);
        this.cdr?.markForCheck?.();
        return of(null);
      })
    ).subscribe(res => {
      if (!res) {
        return;
      }
      this.setLoading(false);
      this._page = res;
      const councils = res.content;
      console.log(councils);
      // Инициализируем UI-поля для всех элементов
      councils.forEach(council => {
        this.initializeCouncilUI(council);
        CouncilsComponent.sortCouncilData(council);
      });
      this.councils.set(councils);
      if (councils.length > 0) {
        this.selectCouncil(councils[0]);
      }
      // markForCheck не нужен: councils.set() и selectCouncil() обновляют signals, которые автоматически триггерят change detection
    });
  }

  councilToString(council: CouncilDto) {
    // we perform transforming here
    // because the ui dot not update a view
    // when we use the pipe in the template
    return this._councilPipe.transform(council);
  }

  selectCouncil(council: CouncilDto | null) {
    const currentCouncil = this.selectedCouncil();
    if (currentCouncil) {
      currentCouncil.isEdit = false;
    }
    const currentBureau = this.selectedBureau();
    if (currentBureau) {
      currentBureau.isEdit = false;
    }
    
    if (council) {
      this.initializeCouncilUI(council);
      CouncilsComponent.sortSections(council);
      const bureau = council.bureau;
      if (bureau) {
        this.initializeBureauUI(bureau);
        this.selectedBureau.set(bureau);
      } else {
        this.selectedBureau.set(null);
      }
      // Автоматически раскрываем выбранный совет для лучшего UX
      council.isExpanded = true;
      this.selectedCouncil.set(council);
      // Сбрасываем на первую вкладку и очищаем выбранную секцию
      this.activeTab.set('main');
      this.activeSectionIndex.set(council.sections.length > 0 ? 0 : null);
    } else {
      this.selectedCouncil.set(null);
      this.selectedBureau.set(null);
      this.activeSectionIndex.set(null);
    }
    this.bumpUiStateTick();
  }

  /**
   * Переключение вкладки с проверкой несохранённых изменений
   */
  switchTab(tab: 'main' | 'bureau' | 'sections') {
    if (this.hasUnsavedChanges()) {
      if (!confirm('У вас есть несохранённые изменения. Вы уверены, что хотите переключить вкладку?')) {
        return;
      }
      // Отменяем все режимы редактирования
      this.cancelAllEdits();
    }
    this.activeTab.set(tab);
    // При переключении на секции выбираем первую, если есть
    if (tab === 'sections') {
      const council = this.selectedCouncil();
      if (council && council.sections.length > 0 && this.activeSectionIndex() === null) {
        this.activeSectionIndex.set(0);
      }
    }
  }

  /**
   * Выбор секции по индексу (для мини-навигации)
   */
  selectSectionByIndex(index: number) {
    const council = this.selectedCouncil();
    if (!council || index < 0 || index >= council.sections.length) {
      return;
    }
    // Проверяем несохранённые изменения в текущей секции
    const currentSection = this.selectedSection();
    if (currentSection?.isEdit) {
      if (!confirm('У вас есть несохранённые изменения в текущей секции. Вы уверены, что хотите переключиться?')) {
        return;
      }
      currentSection.isEdit = false;
    }
    this.activeSectionIndex.set(index);
    this.selectedSection.set(council.sections[index]);
    this.bumpUiStateTick();
  }

  /**
   * Отмена всех режимов редактирования
   */
  private cancelAllEdits() {
    const council = this.selectedCouncil();
    if (council) {
      council.isEdit = false;
    }
    const bureau = this.selectedBureau();
    if (bureau) {
      bureau.isEdit = false;
    }
    const section = this.selectedSection();
    if (section) {
      section.isEdit = false;
    }
    // Отменяем режим редактирования для всех секций
    council?.sections?.forEach(s => s.isEdit = false);
    this.bumpUiStateTick();
  }

  editCouncil() {
    const council = this.selectedCouncil();
    if (!council) {
      return;
    }
    council.isEdit = council.isExpanded = true;
    this.editedCouncil = (council.id === 0 ?
      council : CouncilsComponent.copyCouncil(council));
    this.bumpUiStateTick();
  }

  showSearchBelisaWorkerModal() {
    if (!this.editedCouncil) {
      return;
    }
    const belisaValue = this.belisa();
    const filter = belisaValue ? FilterBuilder.equals('org', belisaValue) : null;
    this.setupPersonSelector(person => {
      this.addPersonIfNotExists(this.editedCouncil!.belisaWorkers, person);
    }, filter);
    this.showPersonModal();
  }

  cancelEditCouncil() {
    const council = this.selectedCouncil();
    if (council) {
      council.isEdit = false;
    }
    this.bumpUiStateTick();
  }

  getSelectedCouncilInd(): number {
    const selected = this.selectedCouncil();
    if (!selected) {
      return -1;
    }
    return this.councils().findIndex(council => council === selected);
  }

  saveEditedCouncil() {
    if (!this.editedCouncil) {
      return;
    }
    this._dataService.saveCouncil(this.editedCouncil).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error('Ошибка сохранения совета:', error);
        this._toasty.error("Ошибка сохранения.");
        return of(null);
      })
    ).subscribe(res => {
      if (!res) {
        return;
      }
      this._toasty.success("ГЭС сохранена.");
      this.initializeCouncilUI(res);
      res.isExpanded = true;
      const councils = [...this.councils()];
      const index = this.getSelectedCouncilInd();
      if (index >= 0) {
        councils[index] = res;
        CouncilsComponent.sortCouncils(councils);
        this.councils.set(councils);
        this.selectCouncil(res);
        const selected = this.selectedCouncil();
        if (selected) {
          selected.isExpanded = true;
          CouncilsComponent.sortCouncilData(selected);
        }
      }
      // markForCheck не нужен: selectedBureau.set() обновляет signal, который автоматически триггерит change detection
      // Мутация selected.isExpanded не требует markForCheck, так как это UI-состояние, которое не влияет на computed signals
    });
  }

  addCouncil() {
    const newCouncil = new CouncilDto();
    const councils = [...this.councils(), newCouncil];
    this.councils.set(councils);
    this.selectCouncil(newCouncil);
    this.editCouncil();
  }

  deleteCouncil() {
    const councils = [...this.councils()];
    const index = this.getSelectedCouncilInd();
    if (index >= 0) {
      councils.splice(index, 1);
      this.councils.set(councils);
      this.selectCouncil(councils.length > 0 ? councils[0] : null);
    }
  }

  editBureau() {
    const bureau = this.selectedBureau();
    if (!bureau) {
      return;
    }
    bureau.isEdit = bureau.isExpanded = true;
    this.editedBureau = CouncilsComponent.copyBureau(bureau);
    this.bumpUiStateTick();
  }

  showSearchBureauChairmanModal() {
    if (!this.editedBureau) {
      return;
    }
    this.setupPersonSelector(person => {
      if (this.editedBureau) {
        this.editedBureau.chairman = person;
      }
    }, null);
    this.showPersonModal();
  }

  showSearchBureauDeputyChairmanModal() {
    if (!this.editedBureau) {
      return;
    }
    this.setupPersonSelector(person => {
      if (this.editedBureau) {
        this.editedBureau.deputyChairman = person;
      }
    }, null);
    this.showPersonModal();
  }

  showSearchBureauSecretaryModal() {
    if (!this.editedBureau) {
      return;
    }
    this.setupPersonSelector(person => {
      if (this.editedBureau) {
        this.editedBureau.secretary = person;
      }
    }, null);
    this.showPersonModal();
  }

  showSearchBureauAssessorModal() {
    if (!this.editedBureau) {
      return;
    }
    this.setupPersonSelector(person => {
      if (this.editedBureau) {
        this.addPersonIfNotExists(this.editedBureau.assessors, person);
      }
    }, null);
    this.showPersonModal();
  }

  cancelEditBureau() {
    const bureau = this.selectedBureau();
    if (bureau) {
      bureau.isEdit = false;
    }
    this.bumpUiStateTick();
  }

  saveEditedBureau() {
    if (!this.editedBureau) {
      return;
    }
    this._dataService.saveBureau(this.editedBureau).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error('Ошибка сохранения бюро:', error);
        this._toasty.error("Ошибка сохранения.");
        return of(null);
      })
    ).subscribe(res => {
      if (!res) {
        return;
      }
      this._toasty.success("Бюро сохранено.");
      this.initializeBureauUI(res);
      res.isExpanded = true;
      const council = this.selectedCouncil();
      if (council) {
        council.bureau = res;
        this.selectedBureau.set(res);
        sortPersonsByName(res.assessors);
      }
      // markForCheck не нужен: selectedBureau.set() обновляет signal, который автоматически триггерит change detection
    });
  }

  editSection(section: SectionDto) {
    const currentSection = this.selectedSection();
    if (currentSection) {
      currentSection.isEdit = false;
    }
    this.selectedSection.set(section);
    this.editedSection = (section.id === 0 ?
      section : CouncilsComponent.copySection(section));
    section.isEdit = section.isExpanded = true;
    this.bumpUiStateTick();
  }

  showSearchSectionHeadModal() {
    if (!this.editedSection) {
      return;
    }
    this.setupPersonSelector(person => {
      if (this.editedSection) {
        this.editedSection.head = person;
      }
    }, null);
    this.showPersonModal();
  }

  showSearchSectionDeputyHeadModal() {
    if (!this.editedSection) {
      return;
    }
    this.setupPersonSelector(person => {
      if (this.editedSection) {
        this.editedSection.deputyHead = person;
      }
    }, null);
    this.showPersonModal();
  }

  showSearchSectionSecretaryModal() {
    if (!this.editedSection) {
      return;
    }
    this.setupPersonSelector(person => {
      if (this.editedSection) {
        this.editedSection.secretary = person;
      }
    }, null);
    this.showPersonModal();
  }

  showSearchSectionAssessorModal() {
    if (!this.editedSection) {
      return;
    }
    this.setupPersonSelector(person => {
      if (this.editedSection) {
        this.addPersonIfNotExists(this.editedSection.assessors, person);
      }
    }, null);
    this.showPersonModal();
  }

  cancelEditSection() {
    const section = this.selectedSection();
    if (section) {
      section.isEdit = false;
    }
    this.bumpUiStateTick();
  }

  saveEditedSection(sectionInd: number) {
    if (!this.editedSection) {
      return;
    }
    this._dataService.saveSection(this.editedSection).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error('Ошибка сохранения секции:', error);
        this._toasty.error("Ошибка сохранения.");
        return of(null);
      })
    ).subscribe(section => {
      if (!section) {
        return;
      }
      this._toasty.success("Секция сохранена.");
      this.initializeSectionUI(section);
      section.isExpanded = true;
      const council = this.selectedCouncil();
      if (council && sectionInd >= 0 && sectionInd < council.sections.length) {
        council.sections[sectionInd] = section;
        sortPersonsByName(section.assessors);
      }
      // markForCheck не нужен: selectedSection.set() обновляет signal, который автоматически триггерит change detection
      // Мутация council.sections не требует markForCheck, так как computed hasUnsavedChanges зависит от _uiStateTick, который обновляется через bumpUiStateTick() в других местах
    });
  }

  deleteSection(sectionInd: number) {
    const council = this.selectedCouncil();
    if (council && sectionInd >= 0 && sectionInd < council.sections.length) {
      council.sections.splice(sectionInd, 1);
      this.bumpUiStateTick(); // Используем bumpUiStateTick для консистентности с другими мутациями DTO
      // if (this.editedSection?.id !== 0) {
      //   this._dataService.deleteSection(this.editedSection.id).pipe(
      //     takeUntilDestroyed(this.destroyRef)
      //   ).subscribe();
      // }
    }
  }

  addSection() {
    const council = this.selectedCouncil();
    if (!council) {
      return;
    }
    const newSection = new SectionDto(council.id);
    council.sections.push(newSection);
    // Выбираем новую секцию в мини-навигации
    this.activeSectionIndex.set(council.sections.length - 1);
    this.editSection(newSection);
  }

  showPersonModal() {
    // Просто показываем модальное окно - фильтр уже установлен в setupPersonSelector
    // Эффект в SearchPersonComponent должен обработать изменение автоматически
    this.searchPersonModal()?.show();
  }

  selectPerson(person: PersonDto) {
    if (this.onPersonSelected) {
      this.onPersonSelected(person);
    }
    this.searchPersonModal()?.hide();
  }

  addDirection() {
    if (!this.newDirection || !this.editedCouncil) {
      return;
    }
    this.editedCouncil.directions.push(this.newDirection);
    this.newDirection = null;
  }

  removeDirection(index: number) {
    if (!this.editedCouncil || index < 0 || index >= this.editedCouncil.directions.length) {
      return;
    }
    this.editedCouncil.directions.splice(index, 1);
  }

  removeBelisaWorker(index: number) {
    if (!this.editedCouncil || index < 0 || index >= this.editedCouncil.belisaWorkers.length) {
      return;
    }
    this.editedCouncil.belisaWorkers.splice(index, 1);
  }

  removeBureauAssessor(index: number) {
    if (!this.editedBureau || index < 0 || index >= this.editedBureau.assessors.length) {
      return;
    }
    this.editedBureau.assessors.splice(index, 1);
  }

  removeSectionAssessor(index: number) {
    if (!this.editedSection || index < 0 || index >= this.editedSection.assessors.length) {
      return;
    }
    this.editedSection.assessors.splice(index, 1);
  }

  static sortCouncils(councils: CouncilDto[]) {
    councils.sort(compareByField('code'));
  }

  static sortSections(council: CouncilDto) {
    council.sections.sort(compareByField('name'));
  }

  static sortCouncilData(council: CouncilDto) {
    sortPersonsByName(council.belisaWorkers);
    if (council.bureau?.assessors) {
      sortPersonsByName(council.bureau.assessors);
    }
    council.sections.forEach(section => sortPersonsByName(section.assessors));
  }

  static copyCouncil(council: CouncilDto) {
    return {
      ...council,
      belisaWorkers: [...council.belisaWorkers],
      isEdit: false
    };
  }

  static copyBureau(bureau: BureauDto): BureauDto {
    return {
      ...bureau,
      assessors: [...bureau.assessors],
      isEdit: false
    };
  }

  static copySection(section: SectionDto): SectionDto {
    return {
      ...section,
      assessors: [...section.assessors],
      isEdit: false
    };
  }

  // Вспомогательные методы для инициализации UI полей
  private initializeCouncilUI(council: CouncilDto) {
    council.isExpanded = council.isExpanded ?? false;
    council.isEdit = council.isEdit ?? false;
    if (council.bureau) {
      this.initializeBureauUI(council.bureau);
    }
    if (council.sections) {
      council.sections.forEach(section => this.initializeSectionUI(section));
    }
  }

  private initializeBureauUI(bureau: BureauDto) {
    bureau.isExpanded = bureau.isExpanded ?? false;
    bureau.isEdit = bureau.isEdit ?? false;
  }

  private initializeSectionUI(section: SectionDto) {
    section.isExpanded = section.isExpanded ?? false;
    section.isEdit = section.isEdit ?? false;
  }

  // Вспомогательные методы для работы с модальными окнами поиска людей
  private setupPersonSelector(handler: (person: PersonPlainDto) => void, filter?: Filter<PersonPlainDto> | null) {
    this.onPersonSelected = handler;
    // Устанавливаем фильтр - если не передан, используем null
    const filterToSet = filter ?? null;
    // Принудительно обновляем фильтр, чтобы гарантировать, что эффект увидит изменение
    // Сначала устанавливаем undefined, затем нужное значение синхронно
    this.searchPersonFilter.set(undefined as any);
    // Устанавливаем нужное значение синхронно, чтобы оно было установлено до вызова showPersonModal
    this.searchPersonFilter.set(filterToSet);
  }

  private addPersonIfNotExists(people: PersonPlainDto[], person: PersonPlainDto) {
    if (!people.find(existing => existing.id === person.id)) {
      people.push(person);
    }
  }
}
