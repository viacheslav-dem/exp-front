import {Component, OnInit} from '@angular/core';
import {AuditService} from "@app/services/audit.service";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";

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
                      <li *ngFor="let p of sessions">
                          {{p | fullName}}
                      </li>
                  </ul>
              </div>
          </div>
      </div>
  `,
  styles: []
})
export class SessionsComponent implements OnInit {

  sessions: PersonPlainDto[];

  constructor(private auditService: AuditService) {
  }

  ngOnInit() {
    this.auditService.getSessions().subscribe(sessions => this.sessions = sessions);
  }

}
