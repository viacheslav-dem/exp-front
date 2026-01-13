import {Component, ChangeDetectionStrategy, signal, inject, DestroyRef} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PersonDto } from "@app/dto/PersonDto";
import { CustomPipesModule } from "@app/pipes/custom-pipes.module";

@Component({
    selector: 'app-best-expert',
    templateUrl: './best-expert.component.html',
    styleUrls: ['./best-expert.component.css'],
    styles: [],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, CustomPipesModule]
})
export class BestExpertComponent {

    private readonly http = inject(HttpClient);
    private readonly destroyRef = inject(DestroyRef);

    private readonly _startDate = signal<string>('');
    private readonly _endDate = signal<string>('');
    readonly expertsList = signal<PersonDto[]>([]);
    readonly loading = signal<boolean>(false);
    readonly _expertsCount = signal<number>(0);

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

    get expertsCount(): number {
        return this._expertsCount();
    }

    set expertsCount(value: number) {
        this._expertsCount.set(value);
    }

    onSubmit() {
        const startDateValue = this._startDate();
        const endDateValue = this._endDate();
        const expertsCountValue = this._expertsCount();
        
        if (!startDateValue || !endDateValue) {
            throw 'Не установлены даты.';
        }
        if (startDateValue > endDateValue) {
            throw 'Дата начала не может быть позже даты конца'
        }
        if (!expertsCountValue) {
            throw 'Не выбрано количество экспертов';
        }
        if (expertsCountValue > 10) {
            throw 'Максимальное количество экспертов - 10'
        }
        if (expertsCountValue < 1) {
            throw 'Минимальное количество экспертов - 1'
        }

        const url = '/examination-api/stats/best-expert';
        const params = new HttpParams()
            .set('startDate', startDateValue)
            .set('endDate', endDateValue)
            .set('expertsCount', expertsCountValue);

        this.loading.set(true);

        this.http.post<PersonDto[]>(url, {}, { params }).pipe(
            tap((response: PersonDto[]) => {
                console.log('Получен ответ:', response);
                this.loading.set(false);
                if (Array.isArray(response)) {
                    this.expertsList.set(response);
                } else {
                    console.error('Неожиданный формат ответа');
                    this.expertsList.set([]);
                }
            }),
            catchError((error) => {
                this.loading.set(false);
                console.error('Ошибка при получении данных', error);
                this.expertsList.set([]);
                return of([]);
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    trackByExpert(_index: number, expert: PersonDto): number | string {
        return expert.id ?? _index;
    }
}
