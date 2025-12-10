import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@app/services/auth.service";
import {Router} from "@angular/router";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PersonService} from "@app/services/person.service";
import {PersonDto} from "@app/dto/PersonDto";
import {Subscription} from "rxjs";
import {StorageService} from "@app/services/storage.service";
import {RoleInfoDto} from "@app/dto/RoleInfoDto";

@Component({
    selector: 'app-loginoff',
    templateUrl: './loginoff.component.html',
    styles: [`
      .dropdown-menu {
          width: 260px;
      }

      .link {
          padding: 0.5rem 0;
      }
    
    .not-link {
        color: #212529;
        text-decoration: none
    }
  `],
    standalone: false
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
              private _storageService: StorageService) {
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

  closeDropdown(menu: HTMLElement) {
    const dropdown = menu.closest('.dropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
      menu.classList.remove('show');
    }
  }
}
