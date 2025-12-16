import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@app/services/auth.service";
import {Router} from "@angular/router";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PersonService} from "@app/services/person.service";
import {PersonDto} from "@app/dto/PersonDto";
import {Subscription} from "rxjs";
import {StorageService} from "@app/services/storage.service";
import {RoleInfoDto} from "@app/dto/RoleInfoDto";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-loginoff',
    templateUrl: './loginoff.component.html',
    styleUrls: ['loginoff.component.scss'],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: environment.features.onPush.loginoff ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class LoginoffComponent implements OnInit, OnDestroy {
  public roles: string[] = [];
  public role: string;
  public currRole;
  public user: PersonDto;
  onCurrentPersonChangedSubscription: Subscription;

  constructor(private router: Router,
              private _authService: AuthService,
              private _personService: PersonService,
              private toasty: GlobalToastyService,
              private dialogService: DialogService,
              private _storageService: StorageService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.role = this._storageService.getCurrRole();
    this._personService.getCurrentPerson().subscribe(res => this.update(res));
    this.onCurrentPersonChangedSubscription = this._personService.onCurrentPersonChanged.subscribe(
      person => this.update(person));

  }

  ngOnDestroy(): void {
    if (this.onCurrentPersonChangedSubscription) {
      this.onCurrentPersonChangedSubscription.unsubscribe();
    }
  }

  update(person: PersonDto) {
    this.user = person;
    this.roles = person.roles;
    // Важно для OnPush/zoneless: обновление пришло асинхронно через сервис
    this.cdr.markForCheck();
  }

  toLogout() {
    this._authService.logout();
  }

  showEditUserModal() {
    this.dialogService.showUserDialog(this.user, true).subscribe(dlgResult => {
      this._personService.saveOrUpdateCurrentPerson(dlgResult.value).subscribe(res => {
        this.toasty.success("Сохранено.");
        this.update(res);
        dlgResult.dlg.close();
      });
    });
  }

  changeRole() {
    this._authService.updateGroupStats()
      .subscribe(() => this.router.navigateByUrl('select-role'));
  }

  changePassword() {
    this.dialogService.showChangePasswordDialog(this.user.user.id).subscribe();
  }

  getUserManual() {
    this._authService.getManual().subscribe(doc => this.dialogService.showPDFViewer("document", doc).subscribe());
  }
}
