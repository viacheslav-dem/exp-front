import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {GlobalToastyService} from "@app/services/global-toasty.service";

interface ToastItem {
  id: number;
  type: 'success' | 'error' | 'warn' | 'info';
  title?: string;
  msg?: string;
}

@Component({
    selector: 'app-global-toasts',
    template: `
    <div class="global-toasts position-fixed" style="bottom: 10px; right: 10px; z-index: 1060;">
      @for (t of toasts; track t.id) {
        <div class="alert" [ngClass]="cssClass(t)" role="alert">
          @if (t.title) {
            <strong>{{ t.title }}</strong>
          }
          @if (t.msg) {
            <span> {{ t.msg }}</span>
          }
        </div>
      }
    </div>
    `,
    standalone: false
})
export class GlobalToastsComponent implements OnInit, OnDestroy {
  toasts: ToastItem[] = [];
  private sub: Subscription;
  private idCounter = 0;

  constructor(private globalToasty: GlobalToastyService) {}

  ngOnInit(): void {
    this.sub = this.globalToasty.globalToastyHandled.subscribe((value: any) => {
      const data = value && value.data ? value.data : {};
      const t: ToastItem = {
        id: ++this.idCounter,
        type: (value.type || 'info') as any,
        title: data.title,
        msg: data.msg
      };
      this.toasts.push(t);
      // Разное время жизни для разных типов сообщений
      // Ошибки показываются дольше, чтобы пользователь успел их прочитать
      const timeout = t.type === 'error' ? 10000 :  // 10 секунд для ошибок
                      t.type === 'warn' ? 7000 :     // 7 секунд для предупреждений
                      5000;                          // 5 секунд для остальных
      setTimeout(() => this.remove(t.id), timeout);
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  cssClass(t: ToastItem) {
    switch (t.type) {
      case 'success':
        return 'alert alert-success';
      case 'error':
        return 'alert alert-danger';
      case 'warn':
        return 'alert alert-warning';
      default:
        return 'alert alert-info';
    }
  }
}
