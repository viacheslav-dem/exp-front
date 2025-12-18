import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {SystemNotificationService} from "@app/services/system-notification.service";
import {SystemNotificationDto,} from "@app/dto/SystemNotificationDto";
import {SafeHtmlPipe} from "@app/pipes/safe-html-pipe";
import {environment} from "../../../environments/environment";

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


    constructor(private notificationService: SystemNotificationService,
                private dialogService: DialogService,
                private safeHtmlPipe: SafeHtmlPipe,
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
        this.dialogService.showConfirmDialog(
            'Сохранение системного уведомления',
            `Сохранить системное уведомление?`,
            'Пожалуйста, проверьте данные уведомления, поскольку предыдущее уведомление заменится новым.')
            .subscribe(() => {

                this.notification.message = message;

                this.notificationService.saveNotification(this.notification).subscribe(res => {
                    this.notification = res;
                    this.cdr?.markForCheck?.();
                });
                window.location.reload();
            })
    }

    deleteNotification() {
        this.dialogService.showConfirmDialog(
            'Удаление системного уведомления',
            `Удалить системное уведомление?`,
            'Уведомление будет удалено из базы данных.')
            .subscribe(() => {

                this.notification.message = "";
                this.notification.enabled = false;
                this.notification.type = "EMPTY_BACKGROUND";

                this.notificationService.saveNotification(this.notification).subscribe(res => {
                    this.notification = res;
                    this.cdr?.markForCheck?.();
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