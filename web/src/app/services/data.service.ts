import {Injectable} from "@angular/core";
import {SERVER_URL} from "@app/config";
import {HttpClientSecure} from "@app/services/http.client";
import {Observable} from "rxjs";
import {OrgDto} from "@app/dto/OrgDto";
import {CouncilDto} from "@app/dto/CouncilDto";
import {HighTechCriteria} from "@app/components/document-form/form-model/high-tech-criteria";
import {BureauDto} from "@app/dto/BureauDto";
import {SectionDto} from "@app/dto/SectionDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {SectionPlainDto} from "@app/dto/SectionPlainDto";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {Page} from "@app/components/common-components/page-and-filter/model/Page";
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";
import {CatalogDto} from "@app/dto/CatalogDto";
import {AuthPolicy, PropertyDto} from "@app/dto/PropertyDto";
import {PropertyPlainDto} from "@app/dto/PropertyPlainDto";
import {DirectionDto} from "@app/dto/DirectionDto";
import {ExpectedResultDto} from "@app/dto/ExpectedResultDto";

@Injectable()
export class DataService {

  public url: string = `${SERVER_URL}/data`;

  constructor(private _http: HttpClientSecure) {
  }

  getCouncils(): Observable<CouncilPlainDto[]> {
    return this._http.getBlock(`${this.url}/council`);
  }

  getCouncilsAdminPage(request: SearchPageRequest): Observable<Page<CouncilDto>> {
    return this._http.post(`${this.url}/council/admin/page`, request);
  }

  saveCouncil(council: CouncilDto): Observable<CouncilDto> {
    return this._http.putBlock(`${this.url}/council`, council);
  }

  saveBureau(bureau: BureauDto): Observable<BureauDto> {
    return this._http.putBlock(`${this.url}/bureau`, bureau);
  }

  saveSection(section: SectionDto): Observable<SectionDto> {
    return this._http.putBlock(`${this.url}/section`, section);
  }

  getSections(councilId): Observable<SectionPlainDto[]> {
    return this._http.get(`${this.url}/council/${councilId}/sections`);
  }

  getCatalog<T extends CatalogDto>(type: string | Catalog): Observable<T[]> {
    return this._http.getBlock<T[]>(`${this.url}/${type}`);
  }

  getCatalogAdminPage<T extends CatalogDto>(type: string | Catalog, request: SearchPageRequest): Observable<Page<T>> {
    return this._http.post<Page<T>>(`${this.url}/${type}/admin/page`, request);
  }

  saveCatalog<T extends CatalogDto>(type: string | Catalog, value: T): Observable<T> {
    return this._http.putBlock<T>(`${this.url}/${type}`, value);
  }

  saveDirection(directionDto: DirectionDto): Observable<DirectionDto>{
    return this._http.putBlock<DirectionDto>(`${this.url}/save/direction`, directionDto);
  }

  getHighTechCriteria(): Observable<HighTechCriteria> {
    return this._http.getBlock(`${this.url}/high-tech-criteria`);
  }

  getOrgs(): Observable<IdNameDto[]> {
    return this._http.getBlock(`${this.url}/org`);
  }

  getGknt(): Observable<IdNameDto> {
    return this._http.getBlock(`${this.url}/gknt`);
  }

  getBelisa(): Observable<IdNameDto> {
    return this._http.getBlock(`${this.url}/belisa`);
  }

  getOrgsAdminPage(request: SearchPageRequest): Observable<Page<OrgDto>> {
    return this._http.post(`${this.url}/org/admin/page`, request);
  }

  saveOrg(org: OrgDto): Observable<OrgDto> {
    return this._http.putBlock(`${this.url}/org`, org);
  }

  getPropertiesAdminPage(request: SearchPageRequest): Observable<Page<PropertyDto>> {
    return this._http.post(`${this.url}/property/admin/page`, request);
  }

  saveProperty(property: PropertyPlainDto): Observable<PropertyDto> {
    return this._http.putBlock(`${this.url}/property`, property);
  }

  savePropertyValue(propertyId: number, value: any): Observable<PropertyDto> {
    return this._http.postBlock(`${this.url}/property/${propertyId}`, value);
  }

  getAuthPolicy(): Observable<AuthPolicy> {
    return this._http.get(`${SERVER_URL}/public/property/auth`);
  }

  getSubOrgs(orgId: IdNameDto): Observable<OrgDto[]> {
    return this._http.postBlock(`${this.url}/${orgId.id}/get-sub-org`, null);
  }

  getAutoSaveTime(): Observable<number> {
    return this._http.get(`${this.url}/get-save-time`);
  }

  getExpectedResult(): Observable<ExpectedResultDto[]> {
    return this._http.get(`${this.url}/expected-result`);
  }

}

export enum Catalog {
  INDUSTRY = 'industry',
  COUNCIL = 'council',
  AREA_OF_COMPETENCE = 'area-of-competence',
  CURRENCY = 'currency',
  STUDY = 'study',
  DIRECTION = 'direction',
  SOCIAL_ECONOMIC_GOAL = 'social-economic-goal',
  PROJECT_CODE = 'project-code',
  FUNDING = 'funding',
  SCIENCE_AREA = 'science-area',
  GKNT_DEPARTMENT = 'gknt-department',
  MAIL_TEMPLATE = 'mail-template',
  MANUAL = 'manual',
  SPECIALITY = 'speciality',
  SPECIALIZATION = 'specialization',
  INDUSTRIAL_PROPERTY = 'industrial-property',
  TARIFF = 'tariff',
  COMMERCIALIZATION_METHODS = 'commercialization-methods'
}
