import {ErrorHandler, NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {appRoutes} from "./app.routing";
import {AppComponent} from "./app.component";
import {HttpClientSecure} from "./services/http.client";
import {GlobalToastyService} from "./services/global-toasty.service";
import {AuthService} from "./services/auth.service";
import {DefineRole} from "./services/define-role";
import {LoginComponent} from "./base/login/login.component";
import {StorageService} from "./services/storage.service";
import {registerLocaleData} from "@angular/common";
import localeRu from '@angular/common/locales/ru';
import localeRuExtra from '@angular/common/locales/extra/ru';
import {ProgressService} from "./components/common-components/progress/progress.service";
import {HelloComponent} from "./base/hello/hello.component";
import {ErrorPageComponent} from "./base/error-page/error-page.component";
import {PersonService} from "./services/person.service";
import {MeetingListComponent} from "./components/meeting-list/meeting-list.component";
import {ProjectInfoComponent} from "./components/project-info/project-info.component";
import {MeetingComponent} from "./components/meeting/meeting.component";
import {ProjectListComponent} from "./components/project-list/project-list.component";
import {LifecycleInfoComponent} from "./components/lifecycle-info/lifecycle-info.component";
import {CouncilsComponent} from "./components/data-management/councils/councils.component";
import {UserListComponent} from "./components/user-list/user-list.component";
import {ConfirmReviewListComponent} from "./components/confirm-review-list/confirm-review-list.component";
import {ProjectFormComponent} from "./components/project-form/project-form.component";
import {ProjectNewComponent} from "./components/project-new/project-new.component";
import {LoginoffComponent} from "./components/loginoff/loginoff.component";
import {MenuComponent} from "./components/menu/menu.component";
import {CommonComponentsModule} from "./components/common-components/components.module";
import {AuditComponent} from "./components/audit/audit.component";
import {AuditService} from "./services/audit.service";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {CryptoModule} from "@app/crypto/crypto.module";
import {DocumentFormModule} from "@app/components/document-form/document-form.module";
import {BasicProjectInfoComponent} from "@app/components/basic-project-info/basic-project-info.component";
import {SearchCouncilComponent} from "@app/components/search/search-council/search-council.component";
import {ExpertReviewModule} from "@app/components/expert-review/expert-review.module";
import {LifecycleGroupComponent} from "@app/components/lifecycle-group/lifecycle-group.component";
import {LifecycleGroupListComponent} from "@app/components/lifecycle-group-list/lifecycle-group-list.component";
import {LifecycleService} from "@app/services/lifecycle.service";
import {LifecycleGroupService} from "@app/services/lifecycle-group.service";
import {DecisionTagComponent} from "@app/components/decision-tag/decision-tag.component";
import {ProjectService} from "@app/services/project.service";
import {ProjectLiComponent} from "@app/components/project-li/project-li.component";
import {ExpertReviewService} from "@app/services/expert-review.service";
import {DataService} from "@app/services/data.service";
import {DocumentService} from "@app/services/document.service";
import {DialogModule} from "@app/components/dialogs/dialog.module";
import {AgendaChatComponent} from "@app/components/agenda-chat/agenda-chat.component";
import {CommentListComponent} from "@app/components/comment-list/comment-list.component";
import {AccountingService} from "@app/services/accounting.service";
import {AccountingComponent} from "@app/components/accounting/accounting.component";
import {TransitionHistoryService} from "@app/services/transition-history.service";
import {TransitionHistoryModule} from "@app/components/transition-history/transition-history.module";
import {StatsService} from "@app/services/stats.service";
import {ExpertListComponent} from "@app/components/expert-list/expert-list.component";
import {FinishedReviewsSparklineChart} from "@app/components/expert-list/finished-reviews.sparkline.chart";
import {ReviewResultsSparklineChart} from "@app/components/expert-list/review-results.sparkline.chart";
import {ReviewsViolationSparklineChart} from "@app/components/expert-list/reviews-violation.sparkline.chart";
import {DataManagementModule} from "@app/components/data-management/data-management.module";
import {SearchModule} from "@app/components/search/search.module";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {SelectRoleComponent} from "@app/base/select-role/select-role.component";
import {SettingsModule} from "@app/components/settings/settings.module";
import {MeetingFormComponent} from "@app/components/meeting-form/meeting-form.component";
import {MeetingService} from "@app/services/meeting.service";
import {CustomErrorHandler} from "@app/services/custom-error-handler";
import {ExpertReviewListComponent} from "@app/components/expert-review-list/expert-review-list.component";
import {AgendaService} from "@app/services/agenda.service";
import {ProjectListFilteredComponent} from "@app/components/project-list-filtered/project-list-filtered.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {AuthErrorInterceptor} from "@app/http-interceptors/auth-error-interceptor.service";
import {LoggingInterceptor} from "@app/http-interceptors/logging-interceptor";
import {SessionsComponent} from './components/sessions/sessions.component';
import {RootPageComponent} from "@app/components/root-page/root-page.component";
import {ProjectCopyComponent} from "@app/components/project-copy/project-copy.component";
import {SubOrgListComponent} from "@app/components/sub-org-list/sub-org-list.component";
import {UserInfoReadComponent} from "@app/components/user-list/user-info-read.component";
import {ExpertRejectProject} from "@app/components/expert-reject-project/expert-reject-project";
import {SameProjectListComponent} from "@app/components/same-project-list/same-project-list.component";
import {ExpertPayInfoComponent} from "@app/components/expert-pay-info/expert-pay-info.component";
import {MeetingRemarkComponent} from "@app/components/meeting-remark/meeting-remark.component";
import {RemarkResponseComponent} from "@app/components/remark-response/remark-response.component";
import {ChartService} from "@app/services/chart.service";
import { NotificationComponent } from './components/notification/notification.component';
import {SystemNotificationComponent} from "@app/components/system-notification/system-notification.component";
import {SystemNotificationService} from "@app/services/system-notification.service";
import {ErrorInterceptor} from "@app/http-interceptors/error-interceptor";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ruLocale } from 'ngx-bootstrap/locale';
defineLocale('ru', ruLocale);
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LOCALE_ID } from '@angular/core';
import { BackToTopComponent } from './components/common-components/back-to-top/back-to-top.component';
import {LoginesifulComponent} from "@app/components/loginesiful/loginesiful.component";
import {EsifulService} from "@app/services/esiful.service";
import {ConfirmManualSelectionComponent} from "@app/components/manual-expert-selection-request/confirm-manual-expert-selection/confirm-manual-selection.component";

// Регистрация русской локали для Angular
registerLocaleData(localeRu, 'ru', localeRuExtra);

@NgModule({ exports: [
        RouterModule,
        CommonComponentsModule,
        DialogModule,
    ],
    declarations: [
        AppComponent,
        LoginesifulComponent,
        LoginComponent,
        HelloComponent,
        ErrorPageComponent,
        AuditComponent,
        RootPageComponent,
        MeetingListComponent,
        ProjectInfoComponent,
        MeetingComponent,
        LifecycleGroupComponent,
        ProjectListComponent,
        LifecycleInfoComponent,
        UserListComponent,
        UserInfoReadComponent,
        CommentListComponent,
        CouncilsComponent,
        LoginoffComponent,
        AgendaChatComponent,
        DecisionTagComponent,
        SearchCouncilComponent,
        MenuComponent,
        ConfirmReviewListComponent,
        ConfirmManualSelectionComponent,
        LifecycleGroupListComponent,
        ProjectFormComponent,
        ProjectNewComponent,
        BasicProjectInfoComponent,
        ProjectLiComponent,
        AccountingComponent,
        ExpertListComponent,
        FinishedReviewsSparklineChart,
        ReviewResultsSparklineChart,
        ReviewsViolationSparklineChart,
        SelectRoleComponent,
        MeetingFormComponent,
        ProjectListFilteredComponent,
        SessionsComponent,
        ProjectCopyComponent,
        SubOrgListComponent,
        ExpertRejectProject,
        SameProjectListComponent,
        ExpertPayInfoComponent,
        MeetingRemarkComponent,
        RemarkResponseComponent,
        NotificationComponent,
        SystemNotificationComponent,
        BackToTopComponent
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),
        NgSelectModule,
        DialogModule.forRoot(),
        CommonComponentsModule,
        ExpertReviewListComponent,
        ExpertReviewModule,
        TransitionHistoryModule,
        CryptoModule,
        DocumentFormModule,
        SearchModule,
        DataManagementModule,
        SettingsModule,
        FontAwesomeModule,
        TooltipModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        BsDropdownModule.forRoot()], providers: [
        { provide: ErrorHandler, useClass: CustomErrorHandler },
        { provide: LOCALE_ID, useValue: 'ru' },
        { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        StorageService,
        EsifulService,
        HttpClientSecure,
        AuthService,
        GlobalToastyService,
        DefineRole,
        ProgressService,
        PersonService,
        LifecycleGroupService,
        AccountingService,
        LifecycleService,
        AuditService,
        ProjectService,
        ExpertReviewService,
        DataService,
        DocumentService,
        TransitionHistoryService,
        StatsService,
        MeetingService,
        AgendaService,
        ChartService,
        SystemNotificationService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {
}
