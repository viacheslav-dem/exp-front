import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PersonDto} from "@app/dto/PersonDto";
import {DegreeTypePipe} from "@app/pipes/degree.pipe";

@Component({
    selector: 'app-best-expert',
    templateUrl: './best-expert.component.html',
    styleUrls: ['./best-expert.component.css'],
    styles: []
})
export class BestExpertComponent implements OnInit {

    startDate: string;
    endDate: string;
    expertsList: Array<PersonDto> = [];

    constructor(private http: HttpClient,
    public _degreeTypePipe: DegreeTypePipe) { }

    ngOnInit() {

    }

    onSubmit() {
        if (!this.startDate || !this.endDate) {
            console.error('Не установлены даты');
            return;
        }

        console.log('Отправка с датами:', this.startDate, this.endDate);

        const url = '/examination-api/stats/best-expert';
        this.http.post<any[]>(url, {}, {
            params: {
                startDate: this.startDate,
                endDate: this.endDate
            }
        }).subscribe(
            response => {
                console.log('Получен ответ:', response);
                if (Array.isArray(response)) {
                    this.expertsList = response;
                } else {
                    console.error('Неожиданный формат ответа');
                }
            },
            error => {
                console.error('Ошибка при получении данных', error);
            }
        );
    }





    test() {
        console.log(this.expertsList);
    }

    protected readonly releaseEvents = releaseEvents;
}
