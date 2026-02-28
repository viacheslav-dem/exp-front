import {Component, ChangeDetectionStrategy, signal, ChangeDetectorRef, OnInit, OnDestroy} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {Direction, SortOrder} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {ProjectLiDto} from "@app/dto/ProjectLiDto";
import {ProjectService} from "@app/services/project.service";
import {Router, NavigationEnd} from "@angular/router";
import {filter} from "rxjs/operators";
import {timer} from 'rxjs';

@Component({
    selector: 'app-project-list-filtered',
    templateUrl: './project-list-filtered.component.html',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListFilteredComponent extends FilterAndPages<ProjectLiDto> implements OnInit, OnDestroy {

  projects = signal<ProjectLiDto[]>([]);
  filterName = signal<string | undefined>(undefined);
  private isInitializing = false;

  constructor(private _projectService: ProjectService,
              private _router: Router,
              private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    // Инициализация при первой загрузке
    this.initializeFilter();
    
    // Подписка на события навигации для обработки повторных переходов
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // При каждой навигации проверяем и инициализируем фильтр
        // Только если мы находимся на странице projects-filtered
        if (this._router.url.includes('projects-filtered')) {
          this.initializeFilter();
        }
      });
  }

  ngOnDestroy() {
    // Очистка фильтра после использования, чтобы избежать проблем при следующем открытии
    // НЕ очищаем фильтр здесь, так как он может быть нужен для других компонентов
    // Очистка будет происходить только при явной навигации на другую страницу
  }

  private initializeFilter() {
    // Защита от множественных одновременных вызовов
    if (this.isInitializing) {
      return;
    }
    
    if (!this._projectService.filter) {
      this._router.navigateByUrl('projects').then();
      return;
    }
    
    this.isInitializing = true;
    
    try {
      // Устанавливаем фильтр и сортировку при каждой инициализации
      this._filters = [this._projectService.filter];
      this._sortOrders = [new SortOrder('stateStartDate', Direction.DESC)];
      this.filterName.set(this._projectService.filterName);
      // Всегда обновляем данные при инициализации, чтобы убедиться, что данные актуальны
      this.update();
    } finally {
      // Сбрасываем флаг после небольшой задержки, чтобы избежать множественных вызовов
      timer(100).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.isInitializing = false;
      });
    }
  }

  loadPage() {
    this._projectService.getPage(this._searchRequest).subscribe({
      next: (res) => {
        this._page = res;
        this.projects.set(res.content);
        this.setLoading(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.setLoading(false);
        this.cdr.markForCheck();
      }
    });
  }
}
