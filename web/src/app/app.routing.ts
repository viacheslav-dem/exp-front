import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {LoginComponent} from "./base/login/login.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {DefineRole} from "./services/define-role";
import {HelloComponent} from "./base/hello/hello.component";
import {ErrorPageComponent} from "./base/error-page/error-page.component";
import {MeetingListComponent} from "./components/meeting-list/meeting-list.component";
import {ProjectInfoComponent} from "./components/project-info/project-info.component";
import {MeetingComponent} from "./components/meeting/meeting.component";
import {ProjectListComponent} from "./components/project-list/project-list.component";
import {LifecycleInfoComponent} from "./components/lifecycle-info/lifecycle-info.component";
import {UserListComponent} from "./components/user-list/user-list.component";
import {ConfirmReviewListComponent} from "./components/confirm-review-list/confirm-review-list.component";
import {ProjectNewComponent} from "./components/project-new/project-new.component";
import {AuditComponent} from "./components/audit/audit.component";
import {AccountingComponent} from "@app/components/accounting/accounting.component";
import {PeriodStatsComponent} from "./components/stats/period-stats/period-stats.component";
import {RealTimeStatsComponent} from "./components/stats/real-time-stats/real-time-stats.component";
import {ExpertListComponent} from "@app/components/expert-list/expert-list.component";
import {DataManagementRoutes} from "@app/components/data-management/data-management.module";
import {SelectRoleComponent} from "@app/base/select-role/select-role.component";
import {SettingsComponent} from "@app/components/settings/settings.component";
import {ProjectListFilteredComponent} from "@app/components/project-list-filtered/project-list-filtered.component";
import {SessionsComponent} from "@app/components/sessions/sessions.component";
import {RootPageComponent} from "@app/components/root-page/root-page.component";
import {CouncilStatsComponent} from "@app/components/stats/council-stats/council-stats.component";
import {SubOrgListComponent} from "@app/components/sub-org-list/sub-org-list.component";
import {NotificationComponent} from "@app/components/notification/notification.component";
import {SystemNotificationComponent} from "@app/components/system-notification/system-notification.component";
import {ResultFunComponent} from "@app/components/stats/result-fun/result-fun.component";
import {BestExpertComponent} from "@app/components/stats/best-expert/best-expert.component";

const appRoutes: Routes = [
  {
    path: '',
    component: HelloComponent,
    canActivate: [AuthGuardService, DefineRole]
  },
  {path: 'signin', redirectTo: 'login'},
  {path: 'login', component: LoginComponent},
  {path: 'error', component: ErrorPageComponent},
  {path: 'select-role', component: SelectRoleComponent},
  {
    path: '',
    component: RootPageComponent,
    children: [
      {path: 'meetings', component: MeetingListComponent},
      {path: 'meetings/:id', component: MeetingComponent},
      {path: 'projects', component: ProjectListComponent},
      {path: 'projects-filtered', component: ProjectListFilteredComponent},
      {path: 'projects/:id', component: ProjectInfoComponent},
      {path: 'project/new', component: ProjectNewComponent},
      {path: 'projects/:id/agendas/:agendaId', component: ProjectInfoComponent},
      {path: 'lifecycles/:id', component: LifecycleInfoComponent},
      {path: 'users', component: UserListComponent},
      {path: 'confirm-reports', component: ConfirmReviewListComponent},
      {path: 'audit', component: AuditComponent},
      {path: 'sessions', component: SessionsComponent},
      {path: 'experts', component: ExpertListComponent},
      {path: 'index', component: RealTimeStatsComponent},
      {path: 'result-fun', component: ResultFunComponent},
      {path: 'best-expert', component: BestExpertComponent},
      {path: 'stats', component: PeriodStatsComponent},
      {path: 'council-stats', component: CouncilStatsComponent},
      {path: 'accounting', component: AccountingComponent},
      {path: 'accounting-filtered', component: AccountingComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'sub-org', component: SubOrgListComponent},
      {path: 'notification', component: NotificationComponent},
      {path: 'system-notification', component: SystemNotificationComponent},
      DataManagementRoutes,
    ]
  }
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
