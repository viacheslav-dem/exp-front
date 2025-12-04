import {Component, input} from '@angular/core';
import {AgendaNewFormContent} from "@app/components/document-form/meeting-protocol-form/AgendaNewFormContent";

@Component({
    selector: 'app-customer-replies-block',
    template: `
    <div class="form-sub-group">
      <app-checkbox [(ngModel)]="_form().customerReplies">
        - ответы на замечания в установленный срок от заказчика экспертизы представлены
      </app-checkbox>
    </div>
  `,
    standalone: false
})
export class CustomerRepliesBlockComponent {

  readonly _form = input<AgendaNewFormContent>(undefined);
}
