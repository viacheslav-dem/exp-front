import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PeriodStatsComponent} from './period-stats/period-stats.component';
import {RealTimeStatsComponent} from './real-time-stats/real-time-stats.component';
import {CouncilStatsComponent} from './council-stats/council-stats.component';
import {ResultFunComponent} from './result-fun/result-fun.component';
import {BestExpertComponent} from './best-expert/best-expert.component';
import {CaseProductionComponent} from "@app/components/stats/case-production/case-production.component";

const routes: Routes = [
  {path: 'index', component: RealTimeStatsComponent},
  {path: 'stats', component: PeriodStatsComponent},
  {path: 'council-stats', component: CouncilStatsComponent},
  {path: 'result-fun', component: ResultFunComponent},
  {path: 'case-production', component: CaseProductionComponent},
  {path: 'best-expert', component: BestExpertComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRoutingModule {
}
