import {Injectable, Output, EventEmitter} from '@angular/core';
import {ToastOptions} from "ng2-toasty";
import {isString} from "util";

@Injectable()
export class GlobalToastyService {

  @Output() globalToastyHandled = new EventEmitter();
  active: any = {};

  constructor() { }

  static buildOptions(options, title) {
    if (!options || isString(options)) {
      return {
        title: title,
        msg: options,
      }
    }
    return options;
  }

  info(options){
    this.emit({
      'type':'info',
      'data':GlobalToastyService.buildOptions(options, 'Информация')
    });
  }

  error(options){
    this.emit({
      'type':'error',
      'data':GlobalToastyService.buildOptions(options, 'Ошибка')
    });
  }

  warn(options){
    this.emit({
      'type':'warn',
      'data':GlobalToastyService.buildOptions(options, 'Предупреждение')
    });
  }

  success(options){
    this.emit({
      'type':'success',
      'data':GlobalToastyService.buildOptions(options, 'Завершено успешно')
    });
  }

  err(status: number, message:string) {
    if (this.active["err" + status]) {
      return;
    }
    let toastOptions: ToastOptions = new ToastOptions();
    toastOptions.title = "Ошибка #" + status;
    toastOptions.msg = message;
    toastOptions.onAdd = () => this.active["err" + status] = true;
    toastOptions.onRemove = () => this.active["err" + status] = false;
    this.error(toastOptions);
  }

  private emit(options){
    this.globalToastyHandled.emit(options);
  }
}
