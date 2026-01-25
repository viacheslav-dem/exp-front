import {Component, input, output} from '@angular/core';
import {AgendaNewFormContent} from "@app/components/document-form/meeting-protocol-form/AgendaNewFormContent";

@Component({
    selector: 'app-customer-replies-block',
    template: `
    <div class="form-sub-group">
      <app-checkbox
        [ngModel]="_form()?.customerReplies"
        (ngModelChange)="emitPatch({ customerReplies: $event })"
      >
        - ответы на замечания в установленный срок от заказчика экспертизы представлены
      </app-checkbox>
    </div>
  `,
    standalone: false
})
export class CustomerRepliesBlockComponent {

  readonly _form = input<AgendaNewFormContent>(undefined);
  readonly onConditionsChanged = output<void>();
  readonly formPatch = output<Partial<AgendaNewFormContent>>();

  emitPatch(patch: Partial<AgendaNewFormContent>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit();
  }
}
