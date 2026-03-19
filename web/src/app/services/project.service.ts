import {Injectable} from "@angular/core";
import {SERVER_URL} from "@app/config";
import {ProjectTermsMessages} from "@app/pipes/project-state.pipe";
import {HasStateService} from "@app/services/has-state.service";
import {AuthService} from "@app/services/auth.service";
import {ProjectLiDto} from "@app/dto/ProjectLiDto";
import {Observable} from "rxjs";
import {PageDto} from "@app/dto/PageDto";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {HttpClientSecure} from "@app/services/http.client";
import {DocumentDto} from "@app/dto/DocumentDto";
import {ProjectDto} from "@app/dto/ProjectDto";
import {IdDto} from "@app/dto/IdDto";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {ExpertReviewDto} from "@app/dto/ExpertReviewDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {ProjectLifecycleDto} from "@app/dto/ProjectLifecycleDto";
import {DocumentService} from "@app/services/document.service";
import {noop} from "@app/support/utils";
import {Filter} from "@app/components/common-components/page-and-filter/model/Filter";
import {ProjectReviewsExpertsDto} from "@app/dto/ProjectReviewsExpertsDto";
import {ProjectCopyDto} from "@app/dto/ProjectCopyDto";
import {PersonDto} from "@app/dto/PersonDto";
import {GroupStateDto} from "@app/dto/GroupStateDto";
import {Role} from "@app/pipes/role.pipe";
import {ExpertReviewTermsMessages} from "@app/pipes/review-state.pipe";
import {LifecycleGroupTermsMessages} from "@app/pipes/lifecycle-group-state.pipe";
import {Page} from "@app/components/common-components/page-and-filter/model/Page";

@Injectable()
export class ProjectService extends HasStateService {

  url = SERVER_URL + '/project';

  // for project-list-filtered.component
  private static readonly PROJECTS_FILTERED_CACHE_KEY = 'filter_cache_projects-filtered';
  private static readonly PROJECTS_FILTERED_CACHE_VERSION = 1;

  private _filter: Filter<any> | null = null;
  private _filterName: string | null = null;

  get filter(): Filter<any> | null {
    return this._filter;
  }

  set filter(value: Filter<any> | null) {
    this._filter = value;
    this.persistFilteredProjectsState();
  }

  get filterName(): string | null {
    return this._filterName;
  }

  set filterName(value: string | null) {
    this._filterName = value;
    this.persistFilteredProjectsState();
  }

  constructor(protected _authService: AuthService,
              private _http: HttpClientSecure,
              private _documentService: DocumentService) {
    super(_authService);
    // Восстанавливаем состояние projects-filtered при перезагрузке страницы.
    // Риск: localStorage может содержать устаревшие данные. Снижаем риск версионированием и безопасным парсингом.
    // Решение обратимо: достаточно удалить ключ `filter_cache_projects-filtered` и использовать только in-memory поля.
    this.restoreFilteredProjectsState();
    // Подписываемся на событие logout для очистки состояния
    this._authService.onLogout$.subscribe(() => {
      this.clearFilterState();
    });
  }
  
  /**
   * Очищает состояние фильтра проектов.
   * Вызывается при logout для предотвращения использования устаревших данных.
   */
  clearFilterState(): void {
    // Важно: чистим напрямую backing-поля, чтобы не выполнять лишние записи в localStorage через setters.
    this._filter = null;
    this._filterName = null;
    try {
      localStorage.removeItem(ProjectService.PROJECTS_FILTERED_CACHE_KEY);
    } catch {
      // ignore
    }
  }

  private persistFilteredProjectsState(): void {
    try {
      if (!this._filter) {
        localStorage.removeItem(ProjectService.PROJECTS_FILTERED_CACHE_KEY);
        return;
      }

      const payload = {
        v: ProjectService.PROJECTS_FILTERED_CACHE_VERSION,
        filter: this._filter,
        filterName: this._filterName
      };

      localStorage.setItem(ProjectService.PROJECTS_FILTERED_CACHE_KEY, JSON.stringify(payload));
    } catch {
      // Не считаем ошибку критичной: это лишь кэш UI состояния.
    }
  }

  private restoreFilteredProjectsState(): void {
    try {
      const raw = localStorage.getItem(ProjectService.PROJECTS_FILTERED_CACHE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== ProjectService.PROJECTS_FILTERED_CACHE_VERSION) {
        localStorage.removeItem(ProjectService.PROJECTS_FILTERED_CACHE_KEY);
        return;
      }

      // Важно: сохраняем как plain object — бэкенд ожидает JSON со свойствами key/value/operation/filters.
      this._filter = (parsed.filter ?? null) as Filter<any> | null;
      this._filterName = (parsed.filterName ?? null) as string | null;

      // Если фильтр невалиден — не держим мусор в localStorage.
      if (!this._filter?.operation) {
        this.clearFilterState();
      }
    } catch {
      // Если кэш поврежден — очищаем, чтобы не ломать навигацию.
      this.clearFilterState();
    }
  }

  prepareProject(project: ProjectDto | ProjectLiDto) {
    this.prepare(project, this.getMessagesByRole());
  }

  getMessagesByRole() {
    switch (this._authService.getCurrRole()) {
      case Role.EXPERT:
        return ExpertReviewTermsMessages;
      case Role.BUREAU_ASSESSOR:
      case Role.BUREAU_CHAIRMAN:
        return LifecycleGroupTermsMessages;
      default:
        return ProjectTermsMessages;
    }
  }

  getPage(request: SearchPageRequest): Observable<PageDto<ProjectLiDto>> {
    return this._http.post(`${this.url}/get`, request);
  }

  getProject(idDto: IdDto): Observable<ProjectDto> {
    return this._http.getBlock(`${this.url}/get/${idDto.id}`);
  }

  getLifecycleGroups(idDto: IdDto): Observable<LifecycleGroupDto[]> {
    return this._http.getBlock(`${this.url}/get/${idDto.id}/groups`);
  }

  getLifecycleGroup(idDto: IdDto): Observable<LifecycleGroupDto> {
    return this._http.getBlock(`${this.url}/get/${idDto.id}/group`);
  }

  getLifecycle(idDto: IdDto): Observable<ProjectLifecycleDto> {
    return this._http.getBlock(`${this.url}/get/${idDto.id}/lifecycle`);
  }

  getReview(idDto: IdDto): Observable<ExpertReviewDto> {
    return this._http.getBlock(`${this.url}/get/${idDto.id}/review`);
  }

  getAnonymousReviews(idDto: IdDto): Observable<DocumentDto[]> {
    return this._http.getBlock(`${this.url}/get-anonymous-reviews/${idDto.id}`);
  }

  getProjectsForMeeting(): Observable<ProjectPlainDto[]> {
    return this._http.getBlock(`${this.url}/get/on-choosing-meeting`);
  }

  attachExpert(idDto: IdDto, expertId: number): Observable<ExpertReviewDto> {
    return this._http.postBlock(`${this.url}/attach/${idDto.id}/expert/${expertId}`, null);
  }

  attachCouncil(idDto: IdDto, councilId: number): Observable<LifecycleGroupDto> {
    return this._http.postBlock(`${this.url}/attach/${idDto.id}/council/${councilId}`, null);
  }

  createProject(project: ProjectDto): Observable<ProjectDto> {
    return this._http.putBlock(`${this.url}/create`, project);
  }

  updateProject(idDto: IdDto, project: ProjectDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/update/${idDto.id}`, project);
  }

  saveCopyProject(project: ProjectCopyDto): Observable<ProjectDto> {
    return this._http.putBlock(`${this.url}/save-copy`, project);
  }

  deleteProject(idDto: IdDto): Observable<any> {
    return this._http.postBlock(`${this.url}/delete/${idDto.id}`, null);
  }

  sendOnExaminationToGknt(idDto: IdDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/send/${idDto.id}/new`, null);
  }

  sendForApproval(idDto: IdDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/send/${idDto.id}/for-approval`, null)
  }

  returnToSubCustomer(idDto: IdDto, reason: string): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/return-sub-customer/${idDto.id}`, {value: reason});
  }

  sendOnExaminationToCouncils(idDto: IdDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/send/${idDto.id}/on-expert-examination`, null);
  }

  sendOnSigning(idDto: IdDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/send/${idDto.id}/on-signing`, null);
  }

  sendOnFinalSigning(idDto: IdDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/send/${idDto.id}/on-final-signing`, null);
  }

  attachWorker(idDto: IdDto, workerId: number): Observable<ProjectDto> {
    return this._http.postBlock<any>(`${this.url}/attach/${idDto.id}/worker/${workerId}`, null);
  }

  returnOnChecking(idDto: IdDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/return/${idDto.id}/on-checking`, null);
  }

  finishProject(idDto: IdDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/send/${idDto.id}/finished`, null);
  }

  returnProject(idDto: IdDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/send/${idDto.id}/returned`, null);
  }

  sendOnDepartmentSigning(idDto: IdDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/send/${idDto.id}/on-department-signing`, null);
  }

  returnOnDepartmentSigning(idDto: IdDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/return/${idDto.id}/on-department-signing`, null);
  }

  returnOnDepartmentFinalSigning(idDto: IdDto): Observable<ProjectDto> {
    return this._http.postBlock(`${this.url}/return/${idDto.id}/on-department-final-signing`, null);
  }

  updateDocument(idDto: IdDto, doc: DocumentDto): Observable<DocumentDto> {
    return this._http.putBlock(`${this.url}/update/${idDto.id}/document`, doc);
  }

  deleteDocument(idDto: IdDto, doc: DocumentDto, onDelete: Function = noop) {
    this._documentService.deleteDocument(doc, `${this.url}/delete/${idDto.id}/document/${doc.id}`, onDelete);
  }

  generateDecisionDocument(idDto: IdDto, form: any): Observable<DocumentDto> {
    return this._documentService.generateDocument(`${this.url}/generate/${idDto.id}/decision`, form);
  }

  deleteDecisionDocument(idDto: IdDto, doc: DocumentDto, onDelete: Function = noop) {
    this._documentService.deleteDocument(doc, `${this.url}/delete/${idDto.id}/decision`, onDelete);
  }

  getConfirmReviewPage(request: SearchPageRequest): Observable<PageDto<ProjectReviewsExpertsDto>> {
    return this._http.post(`${this.url}/get/reviews-on-confirmation`, request);
  }

  getBelisaContacts(idDto: IdDto): Observable<PersonDto[]> {
    return this._http.get(`${this.url}/belisa/${idDto.id}`);
  }

  getGroups(currentRole: string): Observable<GroupStateDto[]> {
    return this._http.get(`${this.url}/get-groups/${currentRole}`);
  }

  markViewed(idDto: IdDto, idGroup: string): Observable<ProjectDto> {
    // Бэкенд ожидает group как строку в body (см. совместимость со старой реализацией в web/bin/src)
    // HttpClientSecure сам сериализует значение через JSON.stringify, поэтому строка уйдет как JSON-string.
    return this._http.postBlock(`${this.url}/mark-viewed/${idDto.id}`, idGroup);
  }

  getTheSameProjectsByTitle(title: string): Observable<ProjectDto[]> {
    return this._http.post(`${this.url}/get-same-projects`, title);
  }

  getExpiredProjectList(
      councilId: number, dateFrom: number, dateTo: number, req: SearchPageRequest
  ): Observable<Page<ProjectDto>> {

    return this._http.postBlock(
        `${this.url}/get-expired-projects`,
        req,
        {params: {councilId: councilId, dateTo: dateTo, dateFrom: dateFrom}}
    );


    //return this._http.getBlock(
    //    `${this.url}/get-expired-projects`,
    //    {params: {councilId: councilId, dateTo: dateTo, dateFrom: dateFrom}}
    //);
  }

  getOnExaminationProjectList(
      councilId: number, dateFrom: number, dateTo: number, req: SearchPageRequest
  ): Observable<Page<ProjectDto>> {

    return this._http.postBlock(
        `${this.url}/get-on-examination-projects`,
        req,
        {params: {councilId: councilId, dateTo: dateTo, dateFrom: dateFrom}}
    );
  }

  automaticExpertSelection(projectId: number): Observable<ExpertReviewDto[]> {
    return this._http.post(`${this.url}/automatic-expert-selection`, projectId)
  }


  sendForSignatureCustomerInEsiful(project: ProjectDto) {

  }
}
