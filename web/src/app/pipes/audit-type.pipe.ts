import {Pipe, PipeTransform} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({name: 'auditType'})
export class AuditTypePipe extends AbstractEnumPipe<AuditTypes>{
  init() {
      this.map[AuditTypes.AUTH] = 'Успешная аутентификация';
      this.map[AuditTypes.AUTH_ERROR] = 'Ошибка аутентификации';
      this.map[AuditTypes.UNKNOWN_ERROR] = 'Неизвестная ошибка';
      this.map[AuditTypes.LOGOUT] = 'Выход из системы';
      this.map[AuditTypes.SESSION_EXPIRED] = 'Время сессии истекло';
      this.map[AuditTypes.UNKNOWN] = 'Не указан';
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
  }
}

export enum AuditTypes {
  AUTH = 'AUTH',
  AUTH_ERROR = 'AUTH_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  LOGOUT = 'LOGOUT',
  UNKNOWN = 'UNKNOWN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
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
}

export function getAllAuditTypes() {
  return Object.keys(AuditTypes);
}
