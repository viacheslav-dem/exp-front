import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from "@angular/core";
import {PersonDto} from "@app/dto/PersonDto";
import {UserFormComponent} from "@app/components/dialogs/user-form/user-form.component";
import {environment} from "../../../environments/environment";


@Component({
    selector: 'app-user-info-read',
    templateUrl: './user-info-read.component.html',
    styles: [
        `.img-holder
      img {
          opacity: 1;
          -webkit-transition: .3s ease-in-out;
          transition: .3s ease-in-out;
          height: 200px;
          width: 200px;
      }
    `
    ],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.coreShell) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})


export class UserInfoReadComponent extends UserFormComponent {
  _user: PersonDto;
  photo: string = 'assets/abstract_profile.jpg';

  @Input() set user(user: PersonDto) {
    if (user) {
      this._user = this.prepareUser(user);
      this.cdr?.markForCheck?.();
    }
  }


}