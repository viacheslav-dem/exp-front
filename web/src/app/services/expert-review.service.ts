import {Injectable} from "@angular/core";
import {SERVER_URL} from "@app/config";
import {ExpertReviewTermsMessages} from "@app/pipes/review-state.pipe";
import {ExpertReviewDto} from "@app/dto/ExpertReviewDto";
import {HasStateService} from "@app/services/has-state.service";
import {AuthService} from "@app/services/auth.service";
import {Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {ExpertReviewPlainDto} from "@app/dto/ExpertReviewPlainDto";
import {HttpClientSecure} from "@app/services/http.client";
import {IdDto} from "@app/dto/IdDto";
import {DocumentDto} from "@app/dto/DocumentDto";
import {DocumentService} from "@app/services/document.service";
import {noop} from "@app/support/utils";
import {ExpertPayInfoDto} from "@app/dto/ExpertPayInfoDto";
import {Page} from "@app/components/common-components/page-and-filter/model/Page";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";
import {DraftService} from "@app/components/document-form/draft.service";
import {ExpertReviewFormContent} from "@app/components/document-form/form-model/ExpertReviewFormContent";


@Injectable()
export class ExpertReviewService extends HasStateService implements DraftService<ExpertReviewFormContent> {

    public url = SERVER_URL + '/review';

    constructor(protected _authService: AuthService,
                private _http: HttpClientSecure,
                private _documentService: DocumentService) {
        super(_authService);
    }

    prepareReview(review: ExpertReviewDto) {
        this.prepare(review, ExpertReviewTermsMessages);
    }

    finishReview(review: IdDto): Observable<ExpertReviewDto> {
        return this._http.postBlock(`${this.url}/finish/${review.id}`, null);
    }

    rollbackReview(review: IdDto): Observable<ExpertReviewDto> {
        return this._http.postBlock(`${this.url}/rollback/${review.id}`, null);
    }

    acceptExpert(review: IdDto): Observable<ExpertReviewPlainDto> {
        return this._http.postBlock(`${this.url}/accept-expert/${review.id}`, null);
    }

    reassignExpert(review: IdDto): Observable<ExpertReviewDto> {
        return this._http.postBlock(`${this.url}/reassign-expert/${review.id}`, null);
    }

    rejectExpert(review: IdDto, reason: string): Observable<ExpertReviewPlainDto> {
        return this._http.postBlock(`${this.url}/reject-expert/${review.id}`, {value: reason});
    }

    acceptProject(review: IdDto): Observable<ExpertReviewDto> {
        return this._http.postBlock(`${this.url}/accept-project/${review.id}`, null);
    }

    rejectProject(review: IdDto, reason: string): Observable<ExpertReviewDto> {
        return this._http.postBlock(`${this.url}/reject-project/${review.id}`, {value: reason});
    }

    generateReviewDocument(review: IdDto, form: any): Observable<ExpertReviewDto> {
        return this._documentService.generateDocument(`${this.url}/generate/${review.id}/review`, form);
    }

    deleteReviewDocument(review: IdDto, doc: DocumentDto, onDelete: Function = noop) {
        this._documentService.deleteDocument(doc, `${this.url}/delete/${review.id}/review`, onDelete);
    }

    deleteReviewScan(review: IdDto) {
        return this._http.postBlock(`${this.url}/delete-scan/${review.id}`, null);
    }

    saveDraft(review: IdDto, draft: any): Observable<ExpertReviewDto> {
        return this._http.post(`${this.url}/save-draft/${review.id}`, draft);
    }

    getDraft(review: IdDto): Observable<any> {
        // Используем неблокирующий запрос для загрузки черновика, чтобы не блокировать UI
        // Если черновика нет (404), это нормально - продолжаем с пустой формой
        return this._http.get(`${this.url}/get-draft/${review.id}`).pipe(
            catchError(err => {
                if (err?.status === 404) {
                    return of(null);
                }
                console.warn('Error loading draft:', err);
                return of(null);
            })
        );
    }

    getExpertPayInfo(expertId: number, page: PageRequest): Observable<Page<ExpertPayInfoDto>> {
        return this._http.postBlock(`${this.url}/get-expert-pay-info/${expertId}`, page);
    }
}
