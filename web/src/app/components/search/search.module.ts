import {NgModule} from "@angular/core";
import {CommonComponentsModule} from "@app/components/common-components/components.module";
import {SearchPersonComponent} from "@app/components/search/search-person/search-person.component";
import {SearchPersonAutocompleteComponent} from "@app/components/search/search-person/search-person-autocomplete/search-person-autocomplete.component";
import {SearchSectionComponent} from "@app/components/search/search-section/search-section.component";
import {SearchPersonByRolesComponent} from "@app/components/search/search-person/search-person-by-role.component";
import {SearchExpertComponent} from "@app/components/search/search-person/search-expert/search-expert.component";
import {SearchGkntWorkerComponent} from "@app/components/search/search-person/search-gknt-worker.component";
import {SearchOrgComponent} from "@app/components/search/search-org/search-org.component";
import {
  ProjectListFromStatsComponent
} from "@app/components/stats/project-list-from-stats/project-list-from-stats.component";

@NgModule({
  imports: [
    CommonComponentsModule
  ],
  declarations: [
    SearchExpertComponent,
    SearchPersonByRolesComponent,
    SearchSectionComponent,
    SearchPersonComponent,
    SearchPersonAutocompleteComponent,
    SearchGkntWorkerComponent,
    SearchOrgComponent,
    ProjectListFromStatsComponent,
  ],
  providers: [],
  exports: [
    SearchExpertComponent,
    SearchPersonByRolesComponent,
    SearchSectionComponent,
    SearchPersonComponent,
    SearchPersonAutocompleteComponent,
    SearchGkntWorkerComponent,
    SearchOrgComponent,
    ProjectListFromStatsComponent,
  ]
})
export class SearchModule{

}