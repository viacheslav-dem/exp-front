import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import {DocumentDto} from "@app/dto/DocumentDto";
import * as _ from "lodash";

@Component({
  selector: 'app-file-editor',
  templateUrl: './file-editor.component.html'
})
export class FileEditorComponent implements OnInit {

  doc: DocumentDto;
  @Output() onUpdate: EventEmitter<DocumentDto> = new EventEmitter<DocumentDto>();

  @ViewChild('fileEditorModal') public fileEditorModal: ModalDirective;

  constructor() {
  }

  ngOnInit() {
  }

  @Input() set document(doc) {
    if (doc) {
      this.doc = _.cloneDeep(doc);
    }
  }

  update() {
    this.onUpdate.emit(this.doc);
  }

  hide() {
    this.fileEditorModal.hide();
  }

  show() {
    this.fileEditorModal.show();
  }
}
