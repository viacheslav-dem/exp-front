import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import {DocumentDto} from "@app/dto/DocumentDto";
import * as _ from "lodash";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-file-editor',
    templateUrl: './file-editor.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: environment.features.onPush.fileEditor ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class FileEditorComponent implements OnInit {

  doc: DocumentDto;
  @Output() onUpdate: EventEmitter<DocumentDto> = new EventEmitter<DocumentDto>();

  @ViewChild('fileEditorModal') public fileEditorModal: ModalDirective;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  @Input() set document(doc) {
    if (doc) {
      this.doc = _.cloneDeep(doc);
      // Важно для OnPush/zoneless: обновление внутреннего состояния при входном параметре
      this.cdr.markForCheck();
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
