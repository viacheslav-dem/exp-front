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
          border: none;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          border-radius: 0.5rem;
          margin-top: 0.5rem;
          padding: 0.5rem 0;
      }

      .user-info {
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          cursor: pointer;
          text-align: right;
          min-width: 150px;
          background-color: transparent;
          border: 1px solid transparent;
      }

      .user-info:hover {
          background-color: #e9ecef;
          border-color: #dee2e6;
      }

      .user-name {
          font-weight: 600;
          font-size: 0.9375rem;
          color: #212529;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
      }

      .user-role {
          font-size: 0.8125rem;
          color: #6c757d;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
      }

      .dropdown-item {
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
          border-radius: 0.25rem;
          margin: 0 0.5rem;
      }

      .dropdown-item:hover {
          background-color: #e7f1ff;
          color: #0d6efd;
      }

      .dropdown-item fa-icon {
          margin-right: 0.5rem;
          width: 1rem;
          text-align: center;
      }
    
      .not-link {
          color: #212529;
          text-decoration: none;
      }

      @media (max-width: 991.98px) {
          .user-info {
              min-width: auto;
              padding: 0.375rem 0.5rem;
              text-align: left;
          }

          .user-name {
              font-size: 0.875rem;
              max-width: 150px;
          }

          .user-role {
              font-size: 0.75rem;
              max-width: 150px;
          }
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
}
