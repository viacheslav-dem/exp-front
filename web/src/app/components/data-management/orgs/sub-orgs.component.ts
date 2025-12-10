import {Component, Input} from "@angular/core";
import {OrgDto} from "@app/dto/OrgDto";

@Component({
    selector: 'app-sub-orgs-list',
    template: `
    <ng-container *ngFor="let org of orgs; index as i">
      <div><b>{{i + 1}}.</b> {{org.name}}</div>
    </ng-container>
  `,
    standalone: false
})

export class SubOrgsComponent {

  @Input() orgs: OrgDto[];


}