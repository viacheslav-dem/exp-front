import {Injectable} from '@angular/core';
import {HttpClientSecure} from "./http.client";
import {SERVER_URL} from "../config";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {Observable} from "rxjs";
import {PageDto} from "@app/dto/PageDto";
import {MeetingDto} from "@app/dto/MeetingDto";
import {AuthService} from "@app/services/auth.service";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {IdDto} from "@app/dto/IdDto";
import {MeetingPostDto} from "@app/dto/MeetingPostDto";
import {DocumentDto} from "@app/dto/DocumentDto";
import {noop} from "@app/support/utils";
import {DocumentService} from "@app/services/document.service";
import {RemarksContainerDto} from "@app/dto/RemarksContainerDto";
import {DraftService} from "@app/components/document-form/draft.service";
import {MeetingProtocolNewFormContent} from "@app/components/document-form/meeting-protocol-form/MeetingProtocolNewFormContent";

@Injectable()
export class MeetingService implements DraftService<MeetingProtocolNewFormContent> {

  url = SERVER_URL + '/meeting';

  constructor(private _http: HttpClientSecure,
              private _authService: AuthService,
              private _documentService: DocumentService) {
  }

  getPage(request: SearchPageRequest): Observable<PageDto<MeetingDto>> {
    return this._http.post(`${this.url}/get/${this._authService.getCurrRole()}`, request);
  }

  getMeetingAssessors(meeting: IdDto): Observable<PersonPlainDto[]> {
    return this._http.getBlock(`${this.url}/get/${meeting.id}/assessors`);
  }

  getMeeting(meeting: IdDto): Observable<MeetingDto> {
    return this._http.getBlock(`${this.url}/get/${meeting.id}`);
  }

  finishMeeting(meeting: IdDto): Observable<MeetingDto> {

    return this._http.postBlock(`${this.url}/finish/${meeting.id}/${this._authService.getCurrRole()}`, null);
  }

  cancelMeeting(meeting: IdDto, reason: string): Observable<MeetingDto> {
    return this._http.postBlock(`${this.url}/cancel/${meeting.id}/${this._authService.getCurrRole()}`, {value: reason});
  }

  createMeeting(meeting: MeetingPostDto): Observable<MeetingDto> {
    return this._http.putBlock(`${this.url}/create/${this._authService.getCurrRole()}`, meeting);
  }

  editMeeting(meeting: MeetingPostDto): Observable<MeetingDto> {
    return this._http.postBlock(`${this.url}/edit/${this._authService.getCurrRole()}`, meeting);
  }

  generateCouncilMeetingProtocol(meeting: IdDto, form: any): Observable<DocumentDto[]> {
    return this._documentService.generateDocument(`${this.url}/generate/${meeting.id}/protocol`, form);
  }

  deleteMeetingProtocol(doc: DocumentDto, meeting: IdDto, onDelete: Function = noop) {
    this._documentService.deleteDocument(doc, `${this.url}/delete/${meeting.id}/protocol`, onDelete);
  }

  deleteMeetingProtocolAppendix(doc: DocumentDto, meeting: IdDto, onDelete: Function = noop) {
    this._documentService.deleteDocument(doc, `${this.url}/delete/${meeting.id}/protocol-appendix`, onDelete);
  }

  getRemarks(container: RemarksContainerDto): Observable<RemarksContainerDto> {
    return this._http.postBlock(`${this.url}/get-remarks`, container);
  }

  saveSectionRemarks(container: RemarksContainerDto) {
    return this._http.postBlock(`${this.url}/save-section-remarks`, container);
  }

  saveBureauRemarks(container: RemarksContainerDto){
    return this._http.postBlock(`${this.url}/save-bureau-remarks`, container);
  }

  rescheduleSectionMeeting(container: RemarksContainerDto): Observable<MeetingDto> {
    return this._http.postBlock(`${this.url}/reschedule-section`, container)
  }

  getDraft(draftOwner: IdDto): Observable<MeetingProtocolNewFormContent> {
    return this._http.getBlock(`${this.url}/get-protocol-draft/${draftOwner.id}`);
  }

  saveDraft(draftOwner: IdDto, draft: MeetingProtocolNewFormContent): Observable<any> {
    return this._http.post(`${this.url}/save-protocol-draft/${draftOwner.id}`, draft);
  }
}
