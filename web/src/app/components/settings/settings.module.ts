import {NgModule} from "@angular/core";
import {CommonComponentsModule} from "@app/components/common-components/components.module";
import {SettingsComponent} from "@app/components/settings/settings.component";
import {PropertyComponentResolver} from "@app/components/settings/property-component-resolver.service";
import {AuthPolicyComponent} from "@app/components/settings/auth-policy/auth-policy.component";
import {PasswordPolicyComponent} from "@app/components/settings/password-policy/password-policy.component";
import {ExaminationPolicyComponent} from "@app/components/settings/examination-policy/examination-policy.component";
import {StatesTermsComponent} from "@app/components/settings/states-terms/states-terms.component";
import {PaymentSettingsComponent} from "@app/components/settings/payment-settings/payment-settings.component";
import {SearchModule} from "@app/components/search/search.module";
import {GkntDeputyChairmanProcurationsComponent} from "@app/components/settings/gknt-deputy-chairman-procurations/gknt-deputy-chairman-procurations.component";
import {HighTechCriteriaComponent} from "@app/components/settings/high-tech-criteria/high-tech-criteria.component";
import {OrgsComponent} from "@app/components/settings/orgs/orgs.component";
import { AuditPolicyComponent } from './audit-policy/audit-policy.component';

@NgModule({
  imports: [
    CommonComponentsModule,
    SearchModule,
  ],
  declarations: [
    SettingsComponent,
    AuthPolicyComponent,
    PasswordPolicyComponent,
    ExaminationPolicyComponent,
    StatesTermsComponent,
    PaymentSettingsComponent,
    GkntDeputyChairmanProcurationsComponent,
    HighTechCriteriaComponent,
    OrgsComponent,
    AuditPolicyComponent,
  ],
  entryComponents: [
    AuthPolicyComponent,
    PasswordPolicyComponent,
    ExaminationPolicyComponent,
    StatesTermsComponent,
    PaymentSettingsComponent,
    GkntDeputyChairmanProcurationsComponent,
    HighTechCriteriaComponent,
    OrgsComponent,
    AuditPolicyComponent,
  ],
  providers: [
    PropertyComponentResolver,
  ],
  exports: [
    SettingsComponent,
  ]
})
export class SettingsModule {
}
