import {CommonComponentsModule} from "@app/components/common-components/components.module";
import {NgModule} from "@angular/core";
import {RealTimeStatsComponent} from "@app/components/stats/real-time-stats/real-time-stats.component";
import {ViolationChart} from "@app/components/stats/real-time-stats/violation.chart";
import {PeriodStatsComponent} from "@app/components/stats/period-stats/period-stats.component";
import {ProjectResultsChart} from "@app/components/stats/period-stats/project-results.chart";
import {ReviewResultsChart} from "@app/components/stats/period-stats/review-results.chart";
import {FinishedProjectsChart} from "@app/components/stats/period-stats/finished-projects.chart";
import {FinishedReviewsChart} from "@app/components/stats/period-stats/finished-reviews.chart";
import {PaymentChart} from "@app/components/stats/period-stats/payment.chart";
import {PaymentViolationChart} from "@app/components/stats/period-stats/payment-violation.chart";
import {
    CouncilsExaminationViolationChart
} from "@app/components/stats/period-stats/councils-examination-violation.chart";
import {ReviewsViolationChart} from "@app/components/stats/period-stats/reviews-violation.chart";
import {
    GkntResultsForwardingViolationChart
} from "@app/components/stats/period-stats/gknt-results-forwarding-violation.chart";
import {GkntConsiderationViolationChart} from "@app/components/stats/period-stats/gknt-consideration-violation.chart";
import {CouncilStatsComponent} from "@app/components/stats/council-stats/council-stats.component";
import {CouncilResultsChart} from "@app/components/stats/council-stats/council-results.chart";
import {CouncilProjectsChart} from "@app/components/stats/council-stats/council-projects.chart";
import {SearchModule} from "@app/components/search/search.module";
import {ResultFunComponent} from './result-fun/result-fun.component';
import {BestExpertComponent} from './best-expert/best-expert.component';
import {StatsRoutingModule} from './stats-routing.module';


@NgModule({
    imports: [
        CommonComponentsModule,
        SearchModule,
        StatsRoutingModule
    ],
    declarations: [
        ViolationChart,
        RealTimeStatsComponent,
        PeriodStatsComponent,
        ProjectResultsChart,
        ReviewResultsChart,
        FinishedProjectsChart,
        FinishedReviewsChart,
        PaymentChart,
        PaymentViolationChart,
        CouncilsExaminationViolationChart,
        ReviewsViolationChart,
        GkntResultsForwardingViolationChart,
        GkntConsiderationViolationChart,
        CouncilStatsComponent,
        CouncilResultsChart,
        CouncilProjectsChart,
        BestExpertComponent,
        ResultFunComponent
    ]
})
export class StatsModule {
}
