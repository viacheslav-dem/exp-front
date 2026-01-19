import {Injectable} from '@angular/core';
import {HttpClientSecure} from "./http.client";
import {SERVER_URL} from "../config";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {HasStateService} from "@app/services/has-state.service";
import {LifecycleGroupTermsMessages} from "@app/pipes/lifecycle-group-state.pipe";
import {AuthService} from "@app/services/auth.service";
import {IdDto} from "@app/dto/IdDto";
import {Observable} from "rxjs";
import {ProjectLifecycleDto} from "@app/dto/ProjectLifecycleDto";
import {DocumentDto} from "@app/dto/DocumentDto";
import {noop} from "@app/support/utils";
import {DocumentService} from "@app/services/document.service";
import {CouncilConclusionFormContent} from "@app/components/document-form/form-model/CouncilConclusionFormContent";
import {DraftService} from "@app/components/document-form/draft.service";
import {ReturnFromCouncilWithoutExpertiseFormContent} from "@app/components/document-form/form-model/ReturnFromCouncilWithoutExpertiseFormContent";
import {ProjectDto} from "@app/dto/ProjectDto";

@Injectable()
export class LifecycleGroupService extends HasStateService implements DraftService<CouncilConclusionFormContent> {

  public url = SERVER_URL + '/group';

  constructor(private _http: HttpClientSecure,
              protected _authService: AuthService,
              private _documentService: DocumentService) {
    super(_authService);
  }

  prepareGroup(group: LifecycleGroupDto) {
    this.prepare(group, LifecycleGroupTermsMessages);
  }

  deleteLifecycleGroup(idDto: IdDto) {
    return this._http.deleteBlock(`${this.url}/delete/${idDto.id}`);
  }

  attachSection(idDto: IdDto, sectionId): Observable<ProjectLifecycleDto> {
    return this._http.postBlock(`${this.url}/attach/${idDto.id}/section/${sectionId}`, null);
  }

  changeSection(idLifecycle: IdDto, idGroup: IdDto, sectionId): Observable<LifecycleGroupDto> {
    return this._http.postBlock(`${this.url}/change/${idLifecycle.id}/${idGroup.id}/section/${sectionId}`, null);
  }

  sendBySections(idDto: IdDto): Observable<LifecycleGroupDto> {
    return this._http.postBlock(`${this.url}/send/${idDto.id}/in-processing`, null);
  }

  finishLifecycleGroup(idDto: IdDto): Observable<LifecycleGroupDto> {
    return this._http.postBlock(`${this.url}/send/${idDto.id}/finished`, null);
  }

  generateLifecycleGroupDecisionDocument(idDto: IdDto, form: any): Observable<DocumentDto> {
    return this._documentService.generateDocument(`${this.url}/generate/${idDto.id}/decision`, form);
  }

  generateReferral(idDto: IdDto, form: any): Observable<DocumentDto> {
    return this._documentService.generateDocument(`${this.url}/generate/${idDto.id}/referral`, form);
  }

  generateCouncilConclusion(idDto: IdDto, form: any): Observable<DocumentDto> {
    return this._documentService.generateDocument(`${this.url}/generate/${idDto.id}/conclusion`, form);
  }

  deleteLifecycleGroupDecisionDocument(doc: DocumentDto, idDto: IdDto, onDelete: Function = noop) {
    this._documentService.deleteDocument(doc, `${this.url}/delete/${idDto.id}/decision`, onDelete);
  }

  deleteReferral(doc: DocumentDto, idDto: IdDto, onDelete: Function = noop) {
    this._documentService.deleteDocument(doc, `${this.url}/delete/${idDto.id}/referral`, onDelete);
  }

  deleteCouncilConclusion(doc: DocumentDto, idDto: IdDto, onDelete: Function = noop) {
    this._documentService.deleteDocument(doc, `${this.url}/delete/${idDto.id}/conclusion`, onDelete);
  }

  returnToGknt(idDto: IdDto, formContent: ReturnFromCouncilWithoutExpertiseFormContent): Observable<LifecycleGroupDto> {
    return this._http.postBlock(`${this.url}/return/${idDto.id}`, formContent);
  }

  saveAnswerForBureauRemarks(group: LifecycleGroupDto) {
    return this._http.postBlock(`${this.url}/save-answer-for-remark`, group)
  }

  replyForBureauRemark(group: LifecycleGroupDto) {
    return this._http.postBlock<ProjectDto>(`${this.url}/reply-for-remark`, group)
  }

  returnFromBureauToGKNTlWithoutExamination(idDto: IdDto): Observable<LifecycleGroupDto> {
    return this._http.postBlock(`${this.url}/return-bureau-to-gknt-without-exp/${idDto.id}`, null);
  }

  getDraft(draftOwner: IdDto): Observable<CouncilConclusionFormContent> {
    return this._http.getBlock(`${this.url}/get-conclusion-draft/${draftOwner.id}`);
  }

  saveDraft(draftOwner: IdDto, draft: CouncilConclusionFormContent): Observable<any> {
    return this._http.post(`${this.url}/save-conclusion-draft/${draftOwner.id}`, draft);
  }
}
