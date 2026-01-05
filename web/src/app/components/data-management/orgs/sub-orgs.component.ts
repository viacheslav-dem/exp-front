import {Component, input} from "@angular/core";
import {OrgDto} from "@app/dto/OrgDto";
import {createTrackKeyStore} from "@app/support/utils";

@Component({
    selector: 'app-sub-orgs-list',
    template: `
    @for (org of orgs(); track trackOrg(org); let i = $index) {
      <div><b>{{i + 1}}.</b> {{org.name}}</div>
    }
    `,
    standalone: false
})

export class SubOrgsComponent {

  readonly orgs = input<OrgDto[]>(undefined);

  private readonly _trackKey = createTrackKeyStore<object>('sub-orgs:');

  trackOrg(org: OrgDto): number | string {
    return org.id || this._trackKey(org);
  }


}