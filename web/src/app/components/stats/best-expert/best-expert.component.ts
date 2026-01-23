import {Component, ChangeDetectionStrategy, signal, inject, DestroyRef} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PersonDto } from "@app/dto/PersonDto";
import { CustomPipesModule } from "@app/pipes/custom-pipes.module";
import {PersonRatingRowDto} from "@app/dto/PersonRatingRowDto";
import {ScoreItemDto} from "@app/dto/ScoreItemDto";

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

    readonly startDate = signal<string>('');
    readonly endDate = signal<string>('');
    readonly expertsList = signal<PersonRatingRowDto[]>([]);
    readonly loading = signal<boolean>(false);
    readonly expertsCount = signal<number>(0);

    test: boolean = false;

    onSubmit() {
        const startDateValue = this.startDate();
        const endDateValue = this.endDate();
        const expertsCountValue = this.expertsCount();
        
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

        this.http.post<PersonRatingRowDto[]>(url, {}, { params }).pipe(
            tap((response: PersonRatingRowDto[]) => {
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

    trackByExpert(_index: number, expert: PersonRatingRowDto): number | string {
        return expert.person.id ?? _index;
    }

    getCoefficient(items: ScoreItemDto[], coefficientType: string): number {
        return items.find(item => item.ruleCode == coefficientType)?.points || 1.0;
    }
}
