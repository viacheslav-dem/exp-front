import {Injectable, Type} from "@angular/core";
import {AuthPolicyComponent} from "@app/components/settings/auth-policy/auth-policy.component";
import {PropertyComponent} from "@app/components/settings/property.component";
import {PasswordPolicyComponent} from "@app/components/settings/password-policy/password-policy.component";
import {ExaminationPolicyComponent} from "@app/components/settings/examination-policy/examination-policy.component";
import {StatesTermsComponent} from "@app/components/settings/states-terms/states-terms.component";
import {PaymentSettingsComponent} from "@app/components/settings/payment-settings/payment-settings.component";
import {GkntDeputyChairmanProcurationsComponent} from "@app/components/settings/gknt-deputy-chairman-procurations/gknt-deputy-chairman-procurations.component";
import {HighTechCriteriaComponent} from "@app/components/settings/high-tech-criteria/high-tech-criteria.component";
import {OrgsComponent} from "@app/components/settings/orgs/orgs.component";
import {AuditPolicyComponent} from "@app/components/settings/audit-policy/audit-policy.component";

@Injectable()
export class PropertyComponentResolver {

  private renderers: { [key: string]: Type<PropertyComponent<any>> } = {
    AUTH_POLICY: AuthPolicyComponent,
    PASSWORD_POLICY: PasswordPolicyComponent,
    EXAMINATION_POLICY: ExaminationPolicyComponent,
    STATES_TERMS: StatesTermsComponent,
    PAYMENT_SETTINGS: PaymentSettingsComponent,
    GKNT_DEPUTY_CHAIRMAN_PROCURATIONS: GkntDeputyChairmanProcurationsComponent,
    HIGH_TECH_CRITERIA: HighTechCriteriaComponent,
    ORGS: OrgsComponent,
    AUDIT_POLICY: AuditPolicyComponent,
  };

  constructor() {
  }

  /**
   * Usage example: <tt>resolver.getRenderer(PropertyType.TARIFF_RATE_1)</tt>
   * @param {string} propertyType
   */
  getRenderer(propertyType: string): Type<PropertyComponent<any>> {
    return this.renderers[propertyType];
  }
}
