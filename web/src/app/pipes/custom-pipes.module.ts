import {MdatePipe} from "./mdate.pipe";
import {RolePipe} from "./role.pipe";
import {ProjectStatePipe} from "./project-state.pipe";
import {ReviewStatePipe} from "./review-state.pipe";
import {PersonFullNamePipe} from "./person-full-name.pipe";
import {ToJsonPipe} from "./to-json.pipe";
import {DocumentTypePipe} from "./document-type.pipe";
import {MeetingStatePipe} from "./meeting-state.pipe";
import {NgModule} from "@angular/core";
import {PhoneTypePipe} from "./phone-type.pipe";
import {BankAccountTypePipe} from "./bank-account-type.pipe";
import {LifecycleGroupStatePipe} from "./lifecycle-group-state.pipe";
import {LifecycleStatePipe} from "./lifecycle-state.pipe";
import {AuditTypePipe} from "./audit-type.pipe";
import {FormatDatePipe, MonthYearPipe, MTimePipe} from "@app/pipes/mdate.pipe";
import {NumberPipe} from "@app/pipes/number.pipe";
import {OrElsePipe} from "@app/pipes/or-else.pipe";
import {DecisionPipe} from "@app/pipes/decision.pipe";
import {CouncilPipe} from "@app/pipes/council.pipe";
import {SectionTypePipe} from "@app/pipes/section-type.pipe";
import {SectionPipe} from "@app/pipes/section.pipe";
import {TemplatePipe} from "@app/pipes/template.pipe";
import {AccountingStatePipe, AccountingTypePipe} from "@app/pipes/accounting.pipe";
import {LifecycleTypePipe} from "@app/pipes/lifecycle-type.pipe";
import {ShortTextPipe} from "@app/pipes/short-text-pipe";
import {DegreePipe, DegreeTypePipe} from "@app/pipes/degree.pipe";
import {AcademicInfoPipe} from "@app/pipes/academic-info.pipe";
import {AreasPipe} from "@app/pipes/areas.pipe";
import {ProjectPipe} from "@app/pipes/project.pipe";
import {MailPriorityPipe} from "@app/pipes/mail-priority.pipe";
import {PhonesPipe} from "@app/pipes/phones.pipe";
import {AcademicTitlePipe, AcademicTitleTypePipe} from "@app/pipes/academic-title.pipe";
import {FullDegreePipe} from "@app/pipes/full-degree.pipe";
import {FundingTypePipe} from "@app/pipes/funding-type.pipe";
import {DatePipe} from "@angular/common";
import {LastSignEnumPipe} from "@app/pipes/last-sign.pipe";
import {SafeHtmlPipe} from "@app/pipes/safe-html-pipe";

@NgModule({
  imports: [],
  exports: [
    MTimePipe,
    MdatePipe,
    FormatDatePipe,
    RolePipe,
    PhoneTypePipe,
    ProjectStatePipe,
    ReviewStatePipe,
    LifecycleGroupStatePipe,
    LifecycleStatePipe,
    PersonFullNamePipe,
    ToJsonPipe,
    DocumentTypePipe,
    MeetingStatePipe,
    BankAccountTypePipe,
    AuditTypePipe,
    NumberPipe,
    OrElsePipe,
    DecisionPipe,
    CouncilPipe,
    SectionTypePipe,
    SectionPipe,
    TemplatePipe,
    AccountingTypePipe,
    AccountingStatePipe,
    LifecycleTypePipe,
    MonthYearPipe,
    ShortTextPipe,
    DegreeTypePipe,
    DegreePipe,
    AcademicInfoPipe,
    AreasPipe,
    ProjectPipe,
    MailPriorityPipe,
    PhonesPipe,
    AcademicTitleTypePipe,
    AcademicTitlePipe,
    FullDegreePipe,
    FundingTypePipe,
    LastSignEnumPipe,
    SafeHtmlPipe
  ],
  declarations: [
    MTimePipe,
    MdatePipe,
    FormatDatePipe,
    PhoneTypePipe,
    LifecycleGroupStatePipe,
    LifecycleStatePipe,
    RolePipe,
    ProjectStatePipe,
    ReviewStatePipe,
    PersonFullNamePipe,
    ToJsonPipe,
    DocumentTypePipe,
    MeetingStatePipe,
    BankAccountTypePipe,
    AuditTypePipe,
    NumberPipe,
    OrElsePipe,
    DecisionPipe,
    CouncilPipe,
    SectionTypePipe,
    SectionPipe,
    TemplatePipe,
    AccountingTypePipe,
    AccountingStatePipe,
    LifecycleTypePipe,
    MonthYearPipe,
    ShortTextPipe,
    DegreeTypePipe,
    DegreePipe,
    AcademicInfoPipe,
    AreasPipe,
    ProjectPipe,
    MailPriorityPipe,
    PhonesPipe,
    AcademicTitleTypePipe,
    AcademicTitlePipe,
    FullDegreePipe,
    FundingTypePipe,
    LastSignEnumPipe,
    SafeHtmlPipe
  ],
  providers: [
    MTimePipe,
    MdatePipe,
    FormatDatePipe,
    PhoneTypePipe,
    LifecycleGroupStatePipe,
    LifecycleStatePipe,
    RolePipe,
    ProjectStatePipe,
    ReviewStatePipe,
    PersonFullNamePipe,
    ToJsonPipe,
    DocumentTypePipe,
    MeetingStatePipe,
    BankAccountTypePipe,
    AuditTypePipe,
    NumberPipe,
    OrElsePipe,
    DecisionPipe,
    CouncilPipe,
    SectionTypePipe,
    SectionPipe,
    TemplatePipe,
    AccountingTypePipe,
    AccountingStatePipe,
    LifecycleTypePipe,
    MonthYearPipe,
    ShortTextPipe,
    DegreeTypePipe,
    DegreePipe,
    AcademicInfoPipe,
    AreasPipe,
    ProjectPipe,
    MailPriorityPipe,
    PhonesPipe,
    AcademicTitleTypePipe,
    AcademicTitlePipe,
    FullDegreePipe,
    FundingTypePipe,
    DatePipe,
    LastSignEnumPipe,
    SafeHtmlPipe
  ]
})
export class CustomPipesModule {
}
