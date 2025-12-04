import { Component, ChangeDetectionStrategy, signal, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PersonDto} from "@app/dto/PersonDto";
import {DegreeTypePipe} from "@app/pipes/degree.pipe";

@Component({
    selector: 'app-best-expert',
    templateUrl: './best-expert.component.html',
    styleUrls: ['./best-expert.component.css'],
    styles: [],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BestExpertComponent {

    private _startDate = signal<string>('');
    private _endDate = signal<string>('');
    expertsList = signal<Array<PersonDto>>([]);
    loading = signal<boolean>(false);

    constructor(
        private http: HttpClient,
        public _degreeTypePipe: DegreeTypePipe,
        private cdr: ChangeDetectorRef
    ) {
    }

    get startDate(): string {
        return this._startDate();
    }

    set startDate(value: string) {
        this._startDate.set(value);
    }

    get endDate(): string {
        return this._endDate();
    }

    set endDate(value: string) {
        this._endDate.set(value);
    }

    onSubmit() {
        const startDateValue = this._startDate();
        const endDateValue = this._endDate();
        
        if (!startDateValue || !endDateValue) {
            console.error('Не установлены даты');
            return;
        }

        console.log('Отправка с датами:', startDateValue, endDateValue);
        const url = '/examination-api/stats/best-expert';

        this.loading.set(true);

        this.http.post<any[]>(url, {}, { params: { startDate: startDateValue, endDate: endDateValue } }).subscribe({
            next: (response) => {
                console.log('Получен ответ:', response);
                this.loading.set(false);
                if (Array.isArray(response)) {
                    this.expertsList.set(response);
                } else {
                    console.error('Неожиданный формат ответа');
                    this.expertsList.set([]);
                }
                this.cdr.markForCheck();
            },
            error: (error) => {
                this.loading.set(false);
                console.error('Ошибка при получении данных', error);
                this.expertsList.set([]);
                this.cdr.markForCheck();
            }
        });
    }

}
