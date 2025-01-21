import {Pipe} from "@angular/core";
import {AbstractEnumPipe} from "@app/pipes/abstract-enum.pipe";

@Pipe({name: 'mailPriority'})
export class MailPriorityPipe extends AbstractEnumPipe<MailPriority> {

  init() {
    this.map[MailPriority.ALWAYS] = 'Отправлять всегда';
    this.map[MailPriority.IMPORTANT] = 'Важное уведомление';
    this.map[MailPriority.REPORT] = 'Информационное сообщение';
  }
}

export enum MailPriority {
  ALWAYS = 'ALWAYS',
  IMPORTANT = 'IMPORTANT',
  REPORT = 'REPORT',
}

export function getAllMailPriorities() {
  return Object.keys(MailPriority);
}
