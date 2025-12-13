import {Injectable, Output, EventEmitter} from '@angular/core';

@Injectable()
export class GlobalToastyService {

  @Output() globalToastyHandled = new EventEmitter();
  active: any = {};

  constructor() { }

  static buildOptions(options, title) {
    if (!options || typeof options === 'string') {
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
    const key = "err" + status;
    if (this.active[key]) {
      return;
    }
    // Устанавливаем флаг синхронно ДО показа toast, чтобы предотвратить дублирование
    this.active[key] = true;
    const toastOptions: any = {
      title: "Ошибка #" + status,
      msg: message,
      onAdd: () => this.active[key] = true,
      onRemove: () => {
        // Очищаем флаг через небольшую задержку после удаления toast,
        // чтобы предотвратить повторное появление при быстрых последовательных ошибках
        setTimeout(() => {
          this.active[key] = false;
        }, 1000);
      }
    };
    this.error(toastOptions);
  }

  private emit(options){
    this.globalToastyHandled.emit(options);
  }
}
