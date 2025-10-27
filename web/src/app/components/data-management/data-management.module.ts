import {NgModule} from "@angular/core";
import {CommonComponentsModule} from "@app/components/common-components/components.module";
import {FundingComponent} from "@app/components/data-management/catalog/funding/funding.component";
import {ScienceAreaComponent} from "@app/components/data-management/catalog/science-area/science-area.component";
import {SimpleCatalogComponent} from "@app/components/data-management/catalog/simple-catalog/simple-catalog.component";
import {OrgsComponent} from "@app/components/data-management/orgs/orgs.component";
import {DirectionsComponent} from "@app/components/data-management/catalog/directions/directions.component";
import {IndustriesComponent} from "@app/components/data-management/catalog/industries/industries.component";
import {TemplatesComponent} from "@app/components/data-management/templates/templates.component";
import {ProjectCodesComponent} from "@app/components/data-management/catalog/project-codes/project-codes.component";
import {AreasOfCompetenceComponent} from "@app/components/data-management/catalog/areas-of-competence/areas-of-competence.component";
import {RouterModule} from "@angular/router";
import {CouncilsComponent} from "@app/components/data-management/councils/councils.component";
import {SearchModule} from "@app/components/search/search.module";
import {Route} from "@angular/router/src/config";
import {GkntDepartmentComponent} from "@app/components/data-management/catalog/gknt-department/gknt-department.component";
import {MailTemplateComponent} from "@app/components/data-management/catalog/mail-template/mail-template.component";
import {UserManualComponent} from './catalog/user-manual/user-manual.component';
import {SpecializationComponent} from "@app/components/data-management/catalog/specialization/specialization.component";
import {SpecialityComponent} from "@app/components/data-management/catalog/speciality/speciality.component";
import {IndustrialPropertyComponent} from "@app/components/data-management/catalog/industrial-property/industrial-property.component";
import {SubOrgsComponent} from "@app/components/data-management/orgs/sub-orgs.component";
import {SocialEconomicGoalsComponent} from "@app/components/data-management/catalog/social-economic-goals/social-economic-goals.component";
import {TariffComponent} from "@app/components/data-management/catalog/tariff/tariff.component";
import {CurrencyComponent} from "@app/components/data-management/catalog/currency/currency.component";
import {MethRecComponent} from "@app/components/data-management/catalog/meth-rec/meth-rec.component";
import {
  CommercializationMethodsComponent
} from "@app/components/data-management/catalog/commercialization-methods/commercialization-methods.component";

export const DataManagementRoutes: Route = {
  path: 'data-management',
  children: [
    {path: '', redirectTo: 'councils', pathMatch: 'full'},
    {path: 'councils', component: CouncilsComponent},
    {path: 'orgs', component: OrgsComponent},
    {path: 'gknt-department', component: GkntDepartmentComponent},
    {path: 'mail-template', component: MailTemplateComponent},
    {path: 'project-codes', component: ProjectCodesComponent},
    {path: 'industries', component: IndustriesComponent},
    {path: 'areas', component: AreasOfCompetenceComponent},
    {path: 'currencies', component: CurrencyComponent},
    {path: 'templates', component: TemplatesComponent},
    {path: 'directions', component: DirectionsComponent},
    {path: 'social-economic-goals', component: SocialEconomicGoalsComponent},
    {path: 'science', component: ScienceAreaComponent},
    {path: 'funding', component: FundingComponent},
    {path: 'manual', component: UserManualComponent},
    {path: 'speciality', component: SpecialityComponent},
    {path: 'specialization', component: SpecializationComponent},
    {path: 'industrial-property', component: IndustrialPropertyComponent},
    {path: 'tariff', component: TariffComponent},
    {path: 'meth-rec', component: MethRecComponent}
    // {path: 'commercialization-methods', component: CommercializationMethodsComponent}
  ]
};

@NgModule({
  imports: [
    RouterModule,
    CommonComponentsModule,
    SearchModule,
  ],
  declarations: [
    FundingComponent,
    ScienceAreaComponent,
    SimpleCatalogComponent,
    OrgsComponent,
    ProjectCodesComponent,
    IndustriesComponent,
    AreasOfCompetenceComponent,
    TemplatesComponent,
    DirectionsComponent,
    GkntDepartmentComponent,
    MailTemplateComponent,
    UserManualComponent,
    SpecializationComponent,
    SpecialityComponent,
    IndustrialPropertyComponent,
    SubOrgsComponent,
    SocialEconomicGoalsComponent,
    TariffComponent,
    CurrencyComponent,
    MethRecComponent,
    CommercializationMethodsComponent
  ],
  providers: [],
  exports: [
    FundingComponent,
    ScienceAreaComponent,
    SimpleCatalogComponent,
    OrgsComponent,
    ProjectCodesComponent,
    IndustriesComponent,
    AreasOfCompetenceComponent,
    TemplatesComponent,
    DirectionsComponent,
    GkntDepartmentComponent,
    MailTemplateComponent,
    SpecializationComponent,
    SpecialityComponent,
    IndustrialPropertyComponent,
    SocialEconomicGoalsComponent,
    TariffComponent,
    CurrencyComponent,
    MethRecComponent,
    CommercializationMethodsComponent
  ]
})
export class DataManagementModule {

}
