import {Component, ChangeDetectionStrategy} from '@angular/core';
import {AuditService} from "@app/services/audit.service";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-sessions',
    template: `
      <div class="row">
        <div class="col-12">
          <div class="card pt-3">
            <h5 class="card-title">
              Активные пользователи:
            </h5>
      
            <ul>
              @for (p of sessions(); track p) {
                <li>
                  {{p | fullName}}
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
      `,
    styles: [],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsComponent {

  sessions = toSignal(this.auditService.getSessions(), { initialValue: [] as PersonPlainDto[] });

  constructor(private auditService: AuditService) {
  }

}
