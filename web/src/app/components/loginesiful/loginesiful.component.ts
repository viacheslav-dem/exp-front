import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@app/services/auth.service";
import {Router} from "@angular/router";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PersonService} from "@app/services/person.service";
import {PersonDto} from "@app/dto/PersonDto";
import {StorageService} from "@app/services/storage.service";
import {environment} from "../../../environments/environment";
import {UserEsiful} from "@app/dto/UserEsiful";
import {EsifulService} from "@app/services/esiful.service";

@Component({
  selector: 'app-loginesiful',
  templateUrl: './loginesiful.component.html',
  styleUrls: ['loginesiful.component.scss'],
  standalone: false,
  changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.coreShell)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class LoginesifulComponent implements OnInit, OnDestroy {
  public roles: string[] = [];
  public role: string;
  public currRole;
  public user: PersonDto;
  public userEsiful: UserEsiful;

  constructor(private router: Router,
              private esifulService: EsifulService,
              private _personService: PersonService,
              private toasty: GlobalToastyService,
              private dialogService: DialogService,
              private _storageService: StorageService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.esifulService.getCurrentUserEsiful().subscribe(res => {
      console.log(res);
      if(res.name == null && res.surname == null){
        this.userEsiful = null;
      } else {
        this.userEsiful = this.update(res);
      }
      // Явно сообщаем Angular об изменениях
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {

  }

  toLogout() {
    this.esifulService.logoutUserEsiful().subscribe();
    this.userEsiful = null;
  }

  inputISEFUL() {
    this.esifulService.inputISEFUL().subscribe(res => {
      console.log("Запрос выполнен");
      console.log(res.codeVerifier);
      console.log(res.signedDataToCheckInCp);
      this._storageService.setCodeVerifier(res.codeVerifier);
      this.esifulService.inputCP(res.signedDataToCheckInCp).subscribe(res => {
        console.log("Запрос выполнен");
        console.log(res);
        if (res['step 0'] === 'OK') {
          const codeVerifier = this._storageService.getCodeVerifier();
          const form = document.createElement('form');
          form.method = 'GET';
          form.action = '/examination-api/esiful/redirect-to-esiful';
          form.style.display = 'none';

          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'data';
          input.value = codeVerifier;
          form.appendChild(input);
          document.body.appendChild(form);
          form.submit();
        }
      });
    });
  }

  private update(res: UserEsiful) {
    return this.userEsiful = res;
  }
}
