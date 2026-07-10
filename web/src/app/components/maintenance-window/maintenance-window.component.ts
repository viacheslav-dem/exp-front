import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {finalize, switchMap, take} from "rxjs";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {MaintenanceWindowService} from "@app/services/maintenance-window.service";
import {MaintenanceWindowDto} from "@app/dto/MaintenanceWindowDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'maintenance-window',
    templateUrl: './maintenance-window.component.html',
    styleUrls: ['./maintenance-window.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.coreShell) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})
export class MaintenanceWindowComponent {

    private _maintenanceService = inject(MaintenanceWindowService);
    private _dialogService = inject(DialogService);
    private _toasty = inject(GlobalToastyService);
    private _destroyRef = inject(DestroyRef);

    readonly maintenanceWindow = signal<MaintenanceWindowDto>(new MaintenanceWindowDto());
    readonly startAtInput = signal('');
    readonly endAtInput = signal('');

    readonly isLoading = signal(true);
    readonly isSaving = signal(false);

    ngOnInit() {
        this._maintenanceService.getMaintenanceWindow().pipe(
            finalize(() => this.isLoading.set(false)),
            takeUntilDestroyed(this._destroyRef),
        ).subscribe({
            next: (res) => this.applyWindow(res ?? new MaintenanceWindowDto()),
            error: () => this.applyWindow(new MaintenanceWindowDto()),
        });
    }

    onEnabledChange(enabled: boolean) {
        this.maintenanceWindow.update(w => ({ ...w, enabled }));
    }

    onMessageChange(message: string) {
        this.maintenanceWindow.update(w => ({ ...w, message }));
    }

    onStartAtInputChange(value: string) {
        this.startAtInput.set(value);
    }

    onEndAtInputChange(value: string) {
        this.endAtInput.set(value);
    }

    save() {
        if (this.isSaving()) {
            return;
        }

        const startAt = this.parseLocalInput(this.startAtInput());
        const endAt = this.parseLocalInput(this.endAtInput());
        const window = { ...this.maintenanceWindow(), startAt, endAt };

        if (window.enabled && (!startAt || !endAt)) {
            this._toasty.err(400, 'Укажите дату и время начала и окончания технических работ.');
            return;
        }
        if (window.enabled && startAt >= endAt) {
            this._toasty.err(400, 'Дата окончания должна быть позже даты начала.');
            return;
        }

        this.maintenanceWindow.set(window);

        const title = window.enabled
            ? 'Включение ограничения входа на период технических работ'
            : 'Сохранение настроек технических работ';
        const message = window.enabled
            ? 'На указанный период вход в систему будет доступен только пользователям с ролью «Администратор». Продолжить?'
            : 'Сохранить настройки технических работ?';
        const description = window.enabled
            ? ''
            : 'Если ограничение выключено, вход в систему доступен всем пользователям как обычно.';

        this._dialogService.showConfirmDialog(title, message, description)
            .pipe(
                take(1),
                switchMap(() => {
                    this.isSaving.set(true);
                    return this._maintenanceService.saveMaintenanceWindow(this.maintenanceWindow()).pipe(
                        finalize(() => this.isSaving.set(false)),
                    );
                }),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe({
                next: (res) => {
                    this.applyWindow(res);
                    this._toasty.success('Сохранено.');
                },
                error: (err) => {
                    console.error('Failed to save maintenance window', err);
                },
            });
    }

    private applyWindow(window: MaintenanceWindowDto) {
        this.maintenanceWindow.set(window);
        this.startAtInput.set(this.formatLocalInput(window.startAt));
        this.endAtInput.set(this.formatLocalInput(window.endAt));
    }

    private formatLocalInput(ms: number | null): string {
        if (!ms) {
            return '';
        }
        const d = new Date(ms);
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    private parseLocalInput(value: string): number | null {
        if (!value) {
            return null;
        }
        const time = new Date(value).getTime();
        return Number.isNaN(time) ? null : time;
    }
}
