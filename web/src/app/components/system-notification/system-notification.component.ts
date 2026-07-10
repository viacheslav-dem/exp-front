import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {SystemNotificationService} from "@app/services/system-notification.service";
import {SystemNotificationDto} from "@app/dto/SystemNotificationDto";
import {environment} from "../../../environments/environment";
import {finalize, EMPTY, switchMap, take} from "rxjs";
import {SystemNotificationStore} from "@app/services/system-notification.store";

@Component({
    selector: 'system-notification',
    templateUrl: './system-notification.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.coreShell) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})
export class SystemNotificationComponent {

    private notificationService = inject(SystemNotificationService);
    private dialogService = inject(DialogService);
    private notificationStore = inject(SystemNotificationStore);
    private destroyRef = inject(DestroyRef);

    notification = signal<SystemNotificationDto>(new SystemNotificationDto());

    readonly notificationNames = getAllEnumNames(SystemNotificationNames);
    readonly notificationTypes = getAllEnumNames(SystemNotificationTypes);

    selectedNotificationName = signal('Оповещение не выбрано');
    selectedNotificationType = signal('Тип оповещения не выбран');

    displayedNotificationStyleClass = signal('');

    isSaving = signal(false);

    readonly hasNotificationSelected = computed(() => this.selectedNotificationName() !== 'Оповещение не выбрано');
    readonly hasMessage = computed(() => this.notification().message !== '');

    ngOnInit() {
        this.notification.set({ ...new SystemNotificationDto(), message: '' });
    }

    changeNotification(selectedName: string) {
        this.selectedNotificationName.set(selectedName);
        const nameKey = Object.keys(SystemNotificationNames)[this.notificationNames.indexOf(selectedName)];

        if (nameKey == null) {
            this.notification.update(n => ({ ...n, message: '' }));
            return;
        }

        const req = { ...this.notification(), name: nameKey };
        this.notificationService.getNotification(req).pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe({
            next: (response) => {
                this.notification.set(response);
                this.selectedNotificationType.set(SystemNotificationTypes[response.type] ?? SystemNotificationTypes.EMPTY_BACKGROUND);
                const styleClass =
                    selectedName === SystemNotificationNames.LOGIN_PAGE_NOTIFICATION
                        ? 'test-card-notification'
                        : selectedName === SystemNotificationNames.ALL_PAGES_NOTIFICATION
                            ? 'card-notification-all-pages'
                            : '';
                this.displayedNotificationStyleClass.set(styleClass);
            },
            error: () => {
                // Запись для этого имени ещё не создана в БД — сбрасываем ВСЮ модель
                // (а не только message), иначе enabled/type/id остаются от предыдущего
                // выбранного уведомления и сохранение может уйти не туда.
                this.notification.set({ ...new SystemNotificationDto(), name: nameKey });
                this.selectedNotificationType.set(SystemNotificationTypes.EMPTY_BACKGROUND);
            },
        });
    }

    changeNotificationType(selectedType: string) {
        this.selectedNotificationType.set(selectedType);
        const typeKey = Object.keys(SystemNotificationTypes)[this.notificationTypes.indexOf(selectedType)];
        this.notification.update(n => ({ ...n, type: typeKey }));
    }

    onEnabledChange(enabled: boolean) {
        this.notification.update(n => ({ ...n, enabled }));
    }

    onMessageChange(message: string) {
        this.notification.update(n => ({ ...n, message }));
    }

    postNotification(message: string) {
        if (this.isSaving()) {
            return;
        }

        this.dialogService.showConfirmDialog(
            'Сохранение системного уведомления',
            `Сохранить системное уведомление?`,
            'Пожалуйста, проверьте данные уведомления, поскольку предыдущее уведомление заменится новым.')
            .pipe(
                take(1),
                switchMap(() => {
                    this.isSaving.set(true);
                    this.notification.update(n => ({ ...n, message: message ?? '' }));
                    return this.notificationService.saveNotification(this.notification()).pipe(
                        finalize(() => this.isSaving.set(false)),
                    );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: (res) => {
                    this.notification.set(res);
                    this.selectedNotificationType.set(SystemNotificationTypes[res?.type] ?? SystemNotificationTypes.EMPTY_BACKGROUND);
                    if (res?.name === 'LOGIN_PAGE_NOTIFICATION') {
                        this.displayedNotificationStyleClass.set('test-card-notification');
                    }
                    if (res?.name === 'ALL_PAGES_NOTIFICATION') {
                        this.displayedNotificationStyleClass.set('card-notification-all-pages');
                    }
                    this.notificationStore.applySaved(res);
                    if (res?.name === 'ALL_PAGES_NOTIFICATION') {
                        this.notificationStore.refreshAllPages();
                    }
                    if (res?.name === 'LOGIN_PAGE_NOTIFICATION') {
                        this.notificationStore.refreshLoginPage();
                    }
                },
                error: (err) => {
                    console.error('Failed to save system notification', err);
                },
            });
    }

    deleteNotification() {
        this.dialogService.showConfirmDialog(
            'Удаление системного уведомления',
            `Удалить системное уведомление?`,
            'Уведомление будет удалено из базы данных.')
            .pipe(
                switchMap(() => {
                    if (this.isSaving()) {
                        return EMPTY;
                    }
                    this.isSaving.set(true);
                    const payload = {
                        ...this.notification(),
                        message: '',
                        enabled: false,
                        type: 'EMPTY_BACKGROUND',
                    };
                    return this.notificationService.saveNotification(payload).pipe(
                        finalize(() => this.isSaving.set(false)),
                    );
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: (res) => {
                    this.notification.set(res);
                    this.notificationStore.applySaved(res);
                    if (res?.name === 'ALL_PAGES_NOTIFICATION') {
                        this.notificationStore.refreshAllPages();
                    }
                    if (res?.name === 'LOGIN_PAGE_NOTIFICATION') {
                        this.notificationStore.refreshLoginPage();
                    }
                },
                error: (err) => {
                    console.error('Failed to delete system notification', err);
                },
            });
    }
}

export enum SystemNotificationNames {
    LOGIN_PAGE_NOTIFICATION = 'Страница авторизации',
    ALL_PAGES_NOTIFICATION = 'Все страницы'
}

export enum SystemNotificationTypes {
    EMPTY_BACKGROUND = 'Обычное сообщение (белый фон)',
    INFORMATION_BACKGROUND = 'Информационное сообщение (голубой фон)',
    WARNING_BACKGROUND = 'Предупреждение (желтый фон)',
    IMPORTANT_BACKGROUND = 'Важное сообщение (красный фон)'
}

export function getAllEnumNames(enumType: Record<string, string>) {
    return Object.keys(enumType).map((key) => enumType[key]);
}
