import { Pipe, PipeTransform } from '@angular/core';
import { AbstractEnumPipe } from '@app/pipes/abstract-enum.pipe';

export enum AuditTypes {
    // Существующие типы
    AUTH = 'AUTH',
    AUTH_ERROR = 'AUTH_ERROR',
    LOGOUT = 'LOGOUT',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    TOKEN_REFRESH = 'TOKEN_REFRESH',
    UNKNOWN = 'UNKNOWN',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    TRANSITION = 'TRANSITION',
    TRANSITION_ERROR = 'TRANSITION_ERROR',
    USER = 'USER',
    USER_ERROR = 'USER_ERROR',
    PASSWORD = 'PASSWORD',
    PASSWORD_ERROR = 'PASSWORD_ERROR',
    COUNCIL = 'COUNCIL',
    COUNCIL_ERROR = 'COUNCIL_ERROR',
    DICTIONARY = 'DICTIONARY',
    DICTIONARY_ERROR = 'DICTIONARY_ERROR',
    PROPERTIES = 'PROPERTIES',
    PROPERTIES_ERROR = 'PROPERTIES_ERROR',
    CRYPTO = 'CRYPTO',
    CRYPTO_ERROR = 'CRYPTO_ERROR',
    MAILING = 'MAILING',
    MAILING_ERROR = 'MAILING_ERROR',

    // НОВЫЕ ТИПЫ ДЛЯ БЕЗОПАСНОСТИ
    SECURITY_ALERT = 'SECURITY_ALERT',
    SECURITY_ALERT_ERROR = 'SECURITY_ALERT_ERROR',
    OPERATION_AUDIT = 'OPERATION_AUDIT',
    OPERATION_AUDIT_ERROR = 'OPERATION_AUDIT_ERROR',
    DATA_ACCESS = 'DATA_ACCESS',
    DATA_ACCESS_ERROR = 'DATA_ACCESS_ERROR',
    DATA_EXPORT = 'DATA_EXPORT',
    DATA_EXPORT_ERROR = 'DATA_EXPORT_ERROR',
    CONFIG_CHANGE = 'CONFIG_CHANGE',
    CONFIG_CHANGE_ERROR = 'CONFIG_CHANGE_ERROR',
    PRIVILEGE_CHANGE = 'PRIVILEGE_CHANGE',
    PRIVILEGE_CHANGE_ERROR = 'PRIVILEGE_CHANGE_ERROR',
    IP_BLOCKED = 'IP_BLOCKED',
    IP_BLOCKED_ERROR = 'IP_BLOCKED_ERROR',
    BRUTE_FORCE = 'BRUTE_FORCE',
    BRUTE_FORCE_ERROR = 'BRUTE_FORCE_ERROR',
    API_ACCESS = 'API_ACCESS',
    API_ACCESS_ERROR = 'API_ACCESS_ERROR',
    SESSION_ANOMALY = 'SESSION_ANOMALY',
    SESSION_ANOMALY_ERROR = 'SESSION_ANOMALY_ERROR',
    INTEGRITY_CHECK = 'INTEGRITY_CHECK',
    INTEGRITY_CHECK_ERROR = 'INTEGRITY_CHECK_ERROR',
    BACKUP_OPERATION = 'BACKUP_OPERATION',
    BACKUP_OPERATION_ERROR = 'BACKUP_OPERATION_ERROR',
    RESTORE_OPERATION = 'RESTORE_OPERATION',
    RESTORE_OPERATION_ERROR = 'RESTORE_OPERATION_ERROR',
    SYSTEM_HEALTH = 'SYSTEM_HEALTH',
    SYSTEM_HEALTH_ERROR = 'SYSTEM_HEALTH_ERROR'
}

@Pipe({
    name: 'auditType',
    standalone: false
})
export class AuditTypePipe extends AbstractEnumPipe<AuditTypes> {
    init() {
        // Существующие типы
        this.map[AuditTypes.AUTH] = 'Успешная аутентификация';
        this.map[AuditTypes.AUTH_ERROR] = 'Ошибка аутентификации';
        this.map[AuditTypes.LOGOUT] = 'Выход из системы';
        this.map[AuditTypes.SESSION_EXPIRED] = 'Время сессии истекло';
        this.map[AuditTypes.TOKEN_REFRESH] = 'Обновление токена доступа';
        this.map[AuditTypes.UNKNOWN] = 'Не указан';
        this.map[AuditTypes.UNKNOWN_ERROR] = 'Неизвестная ошибка';
        this.map[AuditTypes.TRANSITION] = 'Изменение состояния объекта экспертизы';
        this.map[AuditTypes.TRANSITION_ERROR] = 'Ошибка изменения состояния объекта экспертизы';
        this.map[AuditTypes.USER] = 'Редактирование учетной записи пользователя';
        this.map[AuditTypes.USER_ERROR] = 'Ошибка редактирования учетной записи пользователя';
        this.map[AuditTypes.PASSWORD] = 'Изменение пароля';
        this.map[AuditTypes.PASSWORD_ERROR] = 'Ошибка изменения пароля';
        this.map[AuditTypes.COUNCIL] = 'Редактирование ГЭС';
        this.map[AuditTypes.COUNCIL_ERROR] = 'Ошибка редактирования ГЭС';
        this.map[AuditTypes.DICTIONARY] = 'Редактирование справочника';
        this.map[AuditTypes.DICTIONARY_ERROR] = 'Ошибка редактирования справочника';
        this.map[AuditTypes.PROPERTIES] = 'Редактирование настроек';
        this.map[AuditTypes.PROPERTIES_ERROR] = 'Ошибка редактирования настроек';
        this.map[AuditTypes.CRYPTO] = 'Криптографические операции';
        this.map[AuditTypes.CRYPTO_ERROR] = 'Ошибка выполнения криптографических операций';
        this.map[AuditTypes.MAILING] = 'Почтовое уведомление';
        this.map[AuditTypes.MAILING_ERROR] = 'Ошибка при отправке уведомления';

        // НОВЫЕ ТИПЫ ДЛЯ БЕЗОПАСНОСТИ
        this.map[AuditTypes.SECURITY_ALERT] = '⚠️ Оповещение безопасности';
        this.map[AuditTypes.SECURITY_ALERT_ERROR] = '❌ Ошибка оповещения безопасности';
        this.map[AuditTypes.OPERATION_AUDIT] = '📋 Аудит операций';
        this.map[AuditTypes.OPERATION_AUDIT_ERROR] = '❌ Ошибка аудита операций';
        this.map[AuditTypes.DATA_ACCESS] = '📁 Доступ к данным';
        this.map[AuditTypes.DATA_ACCESS_ERROR] = '❌ Ошибка доступа к данным';
        this.map[AuditTypes.DATA_EXPORT] = '📤 Экспорт данных';
        this.map[AuditTypes.DATA_EXPORT_ERROR] = '❌ Ошибка экспорта данных';
        this.map[AuditTypes.CONFIG_CHANGE] = '⚙️ Изменение конфигурации';
        this.map[AuditTypes.CONFIG_CHANGE_ERROR] = '❌ Ошибка изменения конфигурации';
        this.map[AuditTypes.PRIVILEGE_CHANGE] = '🔑 Изменение привилегий';
        this.map[AuditTypes.PRIVILEGE_CHANGE_ERROR] = '❌ Ошибка изменения привилегий';
        this.map[AuditTypes.IP_BLOCKED] = '🚫 Блокировка IP';
        this.map[AuditTypes.IP_BLOCKED_ERROR] = '❌ Ошибка блокировки IP';
        this.map[AuditTypes.BRUTE_FORCE] = '🔒 Обнаружен подбор пароля';
        this.map[AuditTypes.BRUTE_FORCE_ERROR] = '❌ Ошибка определения подбора пароля';
        this.map[AuditTypes.API_ACCESS] = '🔌 Доступ к API';
        this.map[AuditTypes.API_ACCESS_ERROR] = '❌ Ошибка доступа к API';
        this.map[AuditTypes.SESSION_ANOMALY] = '👤 Аномалия сессии';
        this.map[AuditTypes.SESSION_ANOMALY_ERROR] = '❌ Ошибка обнаружения аномалии';
        this.map[AuditTypes.INTEGRITY_CHECK] = '✅ Проверка целостности';
        this.map[AuditTypes.INTEGRITY_CHECK_ERROR] = '❌ Ошибка проверки целостности';
        this.map[AuditTypes.BACKUP_OPERATION] = '💾 Резервное копирование';
        this.map[AuditTypes.BACKUP_OPERATION_ERROR] = '❌ Ошибка резервного копирования';
        this.map[AuditTypes.RESTORE_OPERATION] = '🔄 Восстановление данных';
        this.map[AuditTypes.RESTORE_OPERATION_ERROR] = '❌ Ошибка восстановления данных';
        this.map[AuditTypes.SYSTEM_HEALTH] = '🩺 Проверка здоровья системы';
        this.map[AuditTypes.SYSTEM_HEALTH_ERROR] = '❌ Ошибка проверки здоровья системы';
    }
}

export function getAllAuditTypes() {
    return Object.keys(AuditTypes);
}
