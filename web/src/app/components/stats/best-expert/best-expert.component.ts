import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PersonDto} from "@app/dto/PersonDto";
import {DegreeTypePipe} from "@app/pipes/degree.pipe";

@Component({
    selector: 'app-best-expert',
    templateUrl: './best-expert.component.html',
    styleUrls: ['./best-expert.component.css'],
    styles: [],
    standalone: false
})
export class BestExpertComponent implements OnInit {

    startDate: string;
    endDate: string;
    expertsList: Array<PersonDto> = [];
    loading: boolean = false;


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

        this.loading = true; // Начать загрузку

        this.http.post<any[]>(url, {}, { params: { startDate: this.startDate, endDate: this.endDate } }).subscribe(
            response => {
                console.log('Получен ответ:', response);
                this.loading = false; // Завершить загрузку
                if (Array.isArray(response)) {
                    this.expertsList = response;
                } else {
                    console.error('Неожиданный формат ответа');
                }
            },
            error => {
                this.loading = false; // Завершить загрузку при ошибке
                console.error('Ошибка при получении данных', error);
            }
        );
    }

}
