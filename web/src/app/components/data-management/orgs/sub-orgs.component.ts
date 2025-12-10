import {Component, Input} from "@angular/core";
import {OrgDto} from "@app/dto/OrgDto";

@Component({
    selector: 'app-sub-orgs-list',
    template: `
    @for (org of orgs; track org; let i = $index) {
      <div><b>{{i + 1}}.</b> {{org.name}}</div>
    }
    `,
    standalone: false
})

export class SubOrgsComponent {

  @Input() orgs: OrgDto[];


}