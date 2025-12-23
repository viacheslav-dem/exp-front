import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {SystemNotificationService} from "@app/services/system-notification.service";
import {SystemNotificationDto,} from "@app/dto/SystemNotificationDto";
import {SafeHtmlPipe} from "@app/pipes/safe-html-pipe";
import {environment} from "../../../environments/environment";
import {finalize, take} from "rxjs";
import {SystemNotificationStore} from "@app/services/system-notification.store";

@Component({
    selector: 'system-notification',
    templateUrl: './system-notification.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.coreShell) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class SystemNotificationComponent {

    notification: SystemNotificationDto;

    notificationNames: string[];
    selectedNotificationName = 'Оповещение не выбрано';

    notificationTypes: string[];
    selectedNotificationType= 'Тип оповещения не выбран';

    displayedNotificationStyleClass = "";

    isSaving = false;


    constructor(private notificationService: SystemNotificationService,
                private dialogService: DialogService,
                private safeHtmlPipe: SafeHtmlPipe,
                private notificationStore: SystemNotificationStore,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.notification = new SystemNotificationDto();
        this.notification.message = "";
        this.notificationNames = getAllEnumNames(SystemNotificationNames);
        this.notificationTypes = getAllEnumNames(SystemNotificationTypes);
    }

    public changeNotification(selectedName: string) {

        this.notification.name = Object.keys(SystemNotificationNames)[this.notificationNames.indexOf(selectedName)];

        if (this.notification.name == null) {
            this.notification.message = "";
            this.cdr?.markForCheck?.();
        } else {

            this.notificationService.getNotification(this.notification).subscribe(
                (response) => {
                    this.notification = response;
                    this.selectedNotificationType = SystemNotificationTypes[response.type];

                    switch (this.selectedNotificationName) {
                        case SystemNotificationNames.LOGIN_PAGE_NOTIFICATION:
                            this.displayedNotificationStyleClass = "test-card-notification"; break;
                        case SystemNotificationNames.ALL_PAGES_NOTIFICATION:
                            this.displayedNotificationStyleClass = "card-notification-all-pages"; break;
                    }
                    this.cdr?.markForCheck?.();
                },
                () => {
                    this.notification.message = "";
                    this.cdr?.markForCheck?.();
                });
        }
    }

    public changeNotificationType(selectedType: string) {

        this.notification.type = Object.keys(SystemNotificationTypes)[this.notificationTypes.indexOf(selectedType)];
    }

    postNotification(message: string) {
        if (this.isSaving) {
            return;
        }

        this.dialogService.showConfirmDialog(
            'Сохранение системного уведомления',
            `Сохранить системное уведомление?`,
            'Пожалуйста, проверьте данные уведомления, поскольку предыдущее уведомление заменится новым.')
            .pipe(take(1))
            .subscribe(() => {
                this.isSaving = true;
                this.notification.message = message ?? "";
                this.cdr?.markForCheck?.();

                // Важно: reload должен быть ПОСЛЕ успешного ответа, иначе перезагрузка может оборвать HTTP-запрос.
                this.notificationService.saveNotification(this.notification)
                    .pipe(finalize(() => {
                        this.isSaving = false;
                        this.cdr?.markForCheck?.();
                    }))
                    .subscribe({
                        next: (res) => {
                            this.notification = res;
                            // Обновляем превью-класс (на случай, если changeNotification не вызывался)
                            if (res?.name === 'LOGIN_PAGE_NOTIFICATION') {
                                this.displayedNotificationStyleClass = "test-card-notification";
                            }
                            if (res?.name === 'ALL_PAGES_NOTIFICATION') {
                                this.displayedNotificationStyleClass = "card-notification-all-pages";
                            }
                            this.cdr?.markForCheck?.();
                            // Обновляем глобальные баннеры без reload страницы
                            this.notificationStore.applySaved(res);
                            // Дополнительно перечитываем с сервера (на случай server-side нормализации/дефолтов)
                            if (res?.name === 'ALL_PAGES_NOTIFICATION') {
                                this.notificationStore.refreshAllPages();
                            }
                            if (res?.name === 'LOGIN_PAGE_NOTIFICATION') {
                                this.notificationStore.refreshLoginPage();
                            }
                        },
                        error: (err) => {
                            // Ошибка уже может быть обработана глобальным HttpClientSecure, но лог оставим для диагностики.
                            console.error('Failed to save system notification', err);
                        }
                    });
            });
    }

    deleteNotification() {
        this.dialogService.showConfirmDialog(
            'Удаление системного уведомления',
            `Удалить системное уведомление?`,
            'Уведомление будет удалено из базы данных.')
            .subscribe(() => {

                if (this.isSaving) {
                    return;
                }
                this.isSaving = true;
                this.notification.message = "";
                this.notification.enabled = false;
                this.notification.type = "EMPTY_BACKGROUND";

                this.notificationService.saveNotification(this.notification)
                    .pipe(finalize(() => {
                        this.isSaving = false;
                        this.cdr?.markForCheck?.();
                    }))
                    .subscribe({
                        next: (res) => {
                            this.notification = res;
                            this.notificationStore.applySaved(res);
                            if (res?.name === 'ALL_PAGES_NOTIFICATION') {
                                this.notificationStore.refreshAllPages();
                            }
                            if (res?.name === 'LOGIN_PAGE_NOTIFICATION') {
                                this.notificationStore.refreshLoginPage();
                            }
                            this.cdr?.markForCheck?.();
                        },
                        error: (err) => {
                            console.error('Failed to delete system notification', err);
                        }
                    });
            })
    }

    notificationToSafeHtml(notificationMessage: string) {
        return this.safeHtmlPipe.transform(notificationMessage);
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

export function getAllEnumNames(enumType: any) {

    return Object.keys(enumType).map((key) => enumType[key]);
}