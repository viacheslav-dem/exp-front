import {Observable} from "rxjs";
import {IdDto} from "@app/dto/IdDto";
import {FormContent} from "@app/components/document-form/form-model/FormContent";

export interface DraftService<Form extends FormContent> {

  saveDraft(draftOwner: IdDto, draft: Form): Observable<any>;

  getDraft(draftOwner: IdDto): Observable<Form>;
}
