/**
 * Created by belous.dmitri on 08.02.2017.
 */
import {Component, Input, OnInit} from "@angular/core";
import {Chart} from "@app/components/highchart/highchart.builder";
import {MonthYearPipe} from "@app/pipes/mdate.pipe";
import {acceptedClr, blueClr, rejectedClr, returnedClr} from "@app/components/stats/colors";
import {CouncilStatsDto} from "@app/dto/CouncilStatsDto";
import {CouncilStatsComponent} from "@app/components/stats/council-stats/council-stats.component";
import {CouncilStatsResponseDTO} from "@app/dto/response/CouncilStatsResponseDTO";

@Component({
    selector: 'app-council-projects-chart',
    template: '<highchart [options]="chart"></highchart>'
})
export class CouncilProjectsChart implements OnInit {

    chart: any = Chart.chart().loading().options;

    constructor(private monthYear: MonthYearPipe,
                public councilStatsComponent: CouncilStatsComponent) { }

    ngOnInit(): void { }

    @Input() set stats(stats: CouncilStatsResponseDTO[]) {
        if (!stats) {
            return;
        }
        this.chart = Chart.chart('Объекты экспертизы в ГЭС по месяцам')
            .xAxis(Chart.axis()
                .categories(stats.map(stats => this.monthYear.transform(stats.startDate))))
            .yAxis(Chart.axis('Количество')
                .allowDecimals(false))
            .exporting(Chart.exporting()
                .filename('Объекты экспертизы')
                .size(625, 350))
            .plotOptions(Chart.lineOptions()
                .dataLabels(Chart.dataLabels()
                .enabled(true)))
            .series(Chart.lineOptions('Поступившие')
                .color(blueClr)
                .data(stats.map(stats => stats.projectsReceived)))
            .series(Chart.lineOptions('Рассмотренные')
                .color(acceptedClr)
                .data(stats.map(stats => stats.finishedProjects)))
            .series(Chart.lineOptions('На экспертизе')
                .color(returnedClr)
                .data(stats.map(stats => stats.projectsNotFinished))
                .onClick(
                    (event) => {
                        this.councilStatsComponent.showListProjectsFromStats("on_examination", event.point.category);
                    }
                ))
            .series(Chart.lineOptions('Просроченные')
                .color(rejectedClr)
                .data(stats.map(stats => stats.projectsOverdue))
                .onClick(
                    (event) => {
                        this.councilStatsComponent.showListProjectsFromStats("expired", event.point.category);
                    }
                )
            );
    }
}
