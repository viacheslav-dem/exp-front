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
import {Subject} from "rxjs";
import {switchMap, takeUntil} from "rxjs/operators";

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

  // fix: отписка при уничтожении компонента
  private destroy$ = new Subject<void>();
  constructor(private router: Router,
              private esifulService: EsifulService,
              private _personService: PersonService,
              private toasty: GlobalToastyService,
              private dialogService: DialogService,
              private _storageService: StorageService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.esifulService.getCurrentUserEsiful()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.name == null && res.surname == null) {
            this.userEsiful = null;
          } else {
            this.userEsiful = res;
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Ошибка получения статуса ЭЦП', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // fix: ожидаем ответ сервера перед обнулением UI
  toLogout() {
    this.esifulService.logoutUserEsiful()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.userEsiful = null;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.toasty.error('Ошибка при отключении ЭЦП');
          console.error('Ошибка logout ESIFUL', err);
        }
      });
  }

  // fix: switchMap вместо вложенных subscribe + обработка ошибок
  inputISEFUL() {
    this.esifulService.inputISEFUL().pipe(
      switchMap(res => {
        this._storageService.setCodeVerifier(res.codeVerifier);
        return this.esifulService.inputCP(res.signedDataToCheckInCp);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
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
        } else {
          this.toasty.error('Криптопровайдер не подтвердил запрос');
        }
      },
      error: (err) => {
        this.toasty.error('Ошибка подключения к ЭС ИФЮЛ');
        console.error('Ошибка inputISEFUL', err);
      }
    });
  }
}
