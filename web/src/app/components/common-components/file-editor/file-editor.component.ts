import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, effect, input, output, viewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import {DocumentDto} from "@app/dto/DocumentDto";
import * as _ from "lodash";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-file-editor',
    templateUrl: './file-editor.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.fileAndPdf)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class FileEditorComponent implements OnInit {

  doc: DocumentDto;
  readonly onUpdate = output<DocumentDto>();

  public readonly fileEditorModal = viewChild<ModalDirective>('fileEditorModal');

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  readonly document = input<DocumentDto>(undefined);

  private readonly documentEffect = effect(() => {
    const doc = this.document();
    if (doc) {
      this.doc = _.cloneDeep(doc);
      // Важно для OnPush/zoneless: обновление внутреннего состояния при входном параметре
      this.cdr.markForCheck();
    }
  });

  update() {
    this.onUpdate.emit(this.doc);
  }

  hide() {
    this.fileEditorModal()?.hide();
  }

  show() {
    this.fileEditorModal()?.show();
  }
}
