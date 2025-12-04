import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "@app/services/auth.service";
import {StorageService} from "@app/services/storage.service";
import {RoleInfoDto} from "@app/dto/RoleInfoDto";
import {ActivatedRoute} from "@angular/router";
import {ProjectListComponent} from "@app/components/project-list/project-list.component";

@Component({
    selector: 'app-select-role',
    templateUrl: 'select-role.component.html',
    styles: [`
      .roles-container {
        max-height: 60vh;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0.5rem;
        margin: 0 -0.5rem;
      }
      
      .roles-container::-webkit-scrollbar {
        width: 8px;
      }
      
      .roles-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      
      .roles-container::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
      }
      
      .roles-container::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }
      
      .role-item {
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0.75rem 1rem;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background-color: #ffffff;
        margin-bottom: 0.5rem;
        position: relative;
      }
      
      .role-item:hover:not(.active) {
        background-color: #f8f9fa;
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
        border-color: rgba(13, 110, 253, 0.25);
      }
      
      .role-item:focus {
        outline: 2px solid #0d6efd;
        outline-offset: 2px;
      }
      
      .role-item.alert-danger {
        border-color: rgba(220, 53, 69, 0.25);
        background-color: #f8d7da;
      }
      
      .role-item.alert-danger:hover {
        background-color: #f1aeb5;
        border-color: rgba(220, 53, 69, 0.4);
        box-shadow: 0 0.25rem 0.5rem rgba(220, 53, 69, 0.2);
      }
      
      .role-item.alert-warning {
        border-color: rgba(255, 193, 7, 0.25);
        background-color: #fff3cd;
      }
      
      .role-item.alert-warning:hover {
        background-color: #ffe69c;
        border-color: rgba(255, 193, 7, 0.4);
        box-shadow: 0 0.25rem 0.5rem rgba(255, 193, 7, 0.2);
      }
      
      .role-item.alert-primary {
        border-color: rgba(13, 110, 253, 0.25);
        background-color: #cfe2ff;
      }
      
      .role-item.alert-primary:hover {
        background-color: #b6d4fe;
        border-color: rgba(13, 110, 253, 0.4);
        box-shadow: 0 0.25rem 0.5rem rgba(13, 110, 253, 0.2);
      }
      
      .roles-container:has(.role-item:only-child) {
        padding: 0.75rem;
      }
      
      .card {
        backdrop-filter: blur(10px);
      }
      
      .btn-outline-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 0.25rem 0.5rem rgba(108, 117, 125, 0.3);
      }
      
      .btn-outline-danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 0.25rem 0.5rem rgba(220, 53, 69, 0.3);
      }
      
      @media (max-width: 767.98px) {
        .roles-container {
          max-height: 50vh;
        }
      }
    `],
    standalone: false
})
export class SelectRoleComponent implements OnInit {

  roles: string[] = [];
  currRole: string;
  rolesInfo: RoleInfoDto[] = [];
  mapInfoRole: { [key: string]: RoleInfoDto } = {};
  user: any = {};

  @ViewChild(ProjectListComponent) projectListComponent: ProjectListComponent;

  constructor(private _storageService: StorageService,
              private _authService: AuthService,
              private route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.roles = this._storageService.getRoles();
    this.currRole = this._storageService.getCurrRole();
    this.route.params.subscribe(() => {
      this.getRolesInfo();
      if (this.projectListComponent != null) {
        this.projectListComponent.loadPage();
      }
    });
  }

  enterHow(currRole: string) {
    this._storageService.changeCurrRole(currRole);
  //  this._authService.defaultRedirectUrl();
    this._authService.navigateByUrl();
  }

  getRolesInfo() {
    this.rolesInfo = this._storageService.getRolesInfo();
    this.rolesInfo.forEach(item => this.mapInfoRole[item.role] = item);
  }

  cancel() {
    this._authService.navigateByUrl();
  }

  exit() {
    this._authService.logout();
  }
}
