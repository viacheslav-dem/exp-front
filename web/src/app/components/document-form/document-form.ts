import {Directive, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {FormContent} from "@app/components/document-form/form-model/FormContent";
import {DraftService} from "@app/components/document-form/draft.service";
import {IdDto} from "@app/dto/IdDto";
import {Observable, timer} from "rxjs";
import {takeWhile} from "rxjs/operators";
import {deepClone} from "@app/support/utils";

@Directive()
export class DocumentForm<Form extends FormContent> implements OnInit, OnDestroy {

  _form: Form = this.createNewForm();
  @Output() onSave = new EventEmitter<Form>();
  @Output() onClose = new EventEmitter();
  @Input() draftService: DraftService<Form>;
  @Input() draftOwner: IdDto;
  _draftAutoSaveAlive: boolean = false;
  _draftAutoSaveStartTimeMillis = 30000;
  _draftAutoSavePeriodMillis = 30000;

  ngOnInit() {
  }

  @Input()
  set form(form: Form) {
    this.setForm(form);
  }

  startAutoSave() {
    if (!(this.draftService && this.draftOwner)) {
      return;
    }
    this._draftAutoSaveAlive = true;
    this.draftService.getDraft(this.draftOwner).subscribe(res => {
      this.setForm(res);
      timer(this._draftAutoSaveStartTimeMillis, this._draftAutoSavePeriodMillis)
        .pipe(takeWhile(() => this._draftAutoSaveAlive))
        .subscribe(() => this.saveDraft());
    });
  }

  stopAutoSave() {
    this._draftAutoSaveAlive = false;
  }

  saveDraft() {
    if (this.draftService && this.draftOwner) {
      this.draftService.saveDraft(this.draftOwner, this.getForm()).subscribe();
    }
  }

  createNewForm(): Form {
    return new FormContent() as Form;
  }

  getForm() {
    return deepClone(this._form);
  }

  setForm(form: Form) {
    if (form) {
      this._form = form;
    }
  }

  validate() {
  }

  save() {
    this.validate();
    this.onSave.emit(this.getForm());
  }

  close() {
    this.saveDraft();
    this.stopAutoSave();
    this.onClose.emit(this.getForm());
  }

  ngOnDestroy(): void {
    this.stopAutoSave();
  }
}
