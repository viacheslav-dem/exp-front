import {Component, ChangeDetectionStrategy, computed, signal, effect} from '@angular/core';
import {AuditService} from "@app/services/audit.service";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {toSignal} from "@angular/core/rxjs-interop";
import {Pagination} from "@app/components/common-components/page-and-filter/model/Pagination";
import {Page} from "@app/components/common-components/page-and-filter/model/Page";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";

@Component({
    selector: 'app-sessions',
    template: `
      <div class="row">
        <div class="col-12">
          <div class="card pt-3">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="card-title mb-0">
                <fa-icon icon="users" class="me-2 text-primary"></fa-icon>
                Активные пользователи
              </h5>
              <div class="d-flex align-items-center gap-3">
                <span class="badge bg-primary rounded-pill px-3 py-2">
                  {{activeUsersCount()}}
                </span>
                @if (sessions().length > 0) {
                  <div class="input-group input-group-sm" style="max-width: 300px;">
                    <input type="text" 
                           class="form-control" 
                           placeholder="Поиск по имени..."
                           [value]="searchQuery()"
                           (input)="onSearchChange($any($event.target).value)">
                  </div>
                }
              </div>
            </div>
      
            @if (filteredSessions().length > 0) {
              <!-- Desktop Table View (lg and up) -->
              <div class="table-responsive d-none d-lg-block">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="border-0 fw-semibold small text-muted" style="width: 60px;">
                        <fa-icon icon="circle" class="text-success" style="font-size: 0.5rem;"></fa-icon>
                      </th>
                      <th class="border-0 fw-semibold small text-muted">ФИО</th>
                      <th class="border-0 fw-semibold small text-muted text-end" style="width: 100px;">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (p of paginatedSessions(); track p.id) {
                      <tr class="user-session-row">
                        <td class="align-middle">
                          <fa-icon icon="circle" class="text-success" style="font-size: 0.5rem;"></fa-icon>
                        </td>
                        <td class="fw-medium">
                          <div class="d-flex align-items-center">
                            <div class="avatar-circle-small bg-primary text-white d-flex align-items-center justify-content-center me-2">
                              <fa-icon icon="user" style="font-size: 0.75rem;"></fa-icon>
                            </div>
                            <span [title]="p | fullName">{{p | fullName}}</span>
                          </div>
                        </td>
                        <td class="text-body-secondary small text-end">{{p.id}}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <!-- Mobile/Tablet Compact List View (below lg) -->
              <div class="d-lg-none">
                <div class="list-group list-group-flush">
                  @for (p of paginatedSessions(); track p.id) {
                    <div class="list-group-item px-0 py-2 border-bottom">
                      <div class="d-flex align-items-center">
                        <div class="avatar-circle-small bg-primary text-white d-flex align-items-center justify-content-center me-3">
                          <fa-icon icon="user" style="font-size: 0.75rem;"></fa-icon>
                        </div>
                        <div class="flex-grow-1">
                          <div class="fw-medium">{{p | fullName}}</div>
                          <div class="text-muted small">
                            <fa-icon icon="circle" class="text-success me-1" style="font-size: 0.5rem;"></fa-icon>
                            ID: {{p.id}}
                          </div>
                        </div>
                        <fa-icon icon="circle" class="text-success ms-2" style="font-size: 0.5rem;"></fa-icon>
                      </div>
                    </div>
                  }
                </div>
              </div>
            } @else if (sessions().length > 0) {
              <div class="alert alert-warning mb-0 rounded-4 shadow-sm border-0 p-4">
                <div class="d-flex align-items-center">
                  <fa-icon icon="info-circle" class="me-2 fa-lg"></fa-icon>
                  <span class="fst-italic">Пользователи не найдены по запросу "{{searchQuery()}}"</span>
                </div>
              </div>
            } @else {
              <div class="alert alert-info mb-0 rounded-4 shadow-sm border-0 p-4">
                <div class="d-flex align-items-center">
                  <fa-icon icon="info-circle" class="me-2 fa-lg"></fa-icon>
                  <span class="fst-italic">В системе нет активных пользователей</span>
                </div>
              </div>
            }
            
            @if (filteredSessions().length > 0) {
              <div class="mt-4">
                <app-pagination [page]="_page()" [pagination]="_pagination()"
                (onPageChanged)="onPageChanged($event)"></app-pagination>
              </div>
            }
          </div>
        </div>
      </div>
      `,
    styles: [`
      table {
        background-color: white;
      }

      /* Bootstrap CSS-переменные для белого фона таблицы */
      table.table {
        --bs-table-bg: #ffffff;
        --bs-table-hover-bg: rgba(0, 0, 0, 0.03);
      }

      .user-session-row {
        transition: background-color 0.2s ease;
      }
      
      .user-session-row:hover {
        background-color: #f8f9fa;
      }

      .user-session-row:hover > td {
        background-color: #f8f9fa !important;
      }
      
      .avatar-circle-small {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      
      .list-group-item {
        transition: background-color 0.2s ease;
      }
      
      .list-group-item:hover {
        background-color: #f8f9fa;
      }
    `],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsComponent {

  sessions = toSignal(this.auditService.getSessions(), { initialValue: [] as PersonPlainDto[] });
  searchQuery = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = 50;
  
  activeUsersCount = computed(() => this.sessions().length);
  
  filteredSessions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.sessions();
    }
    return this.sessions().filter(p => {
      const fullName = `${p.personName?.lastName || ''} ${p.personName?.firstName || ''} ${p.personName?.middleName || ''}`.toLowerCase();
      return fullName.includes(query);
    });
  });
  
  paginatedSessions = computed(() => {
    const filtered = this.filteredSessions();
    const currentPageNum = this.currentPage();
    const startIndex = (currentPageNum - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return filtered.slice(startIndex, endIndex);
  });
  
  _pagination = computed(() => {
    const pag = new Pagination(this.pageSize);
    pag.page = this.currentPage();
    return pag;
  });
  
  _page = computed(() => {
    const filtered = this.filteredSessions();
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / this.pageSize);
    const currentPageNum = this.currentPage();
    
    const pageObj = new Page<PersonPlainDto>();
    pageObj.content = this.paginatedSessions();
    pageObj.totalPages = totalPages;
    pageObj.totalElements = totalElements;
    pageObj.size = this.pageSize;
    pageObj.page = currentPageNum;
    
    return pageObj;
  });

  constructor(private auditService: AuditService) {
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1); // Сбрасываем на первую страницу при поиске
  }
  
  onPageChanged(pageRequest: PageRequest): void {
    // PageRequest использует 0-based индексацию, а Pagination - 1-based
    this.currentPage.set(pageRequest.page + 1);
  }

}
