import {Component, ChangeDetectionStrategy, inject, signal, computed} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CommonModule} from "@angular/common";
import {GlobalToastyService} from "@app/services/global-toasty.service";

interface ToastItem {
  id: number;
  type: 'success' | 'error' | 'warn' | 'info';
  title?: string;
  msg?: string;
}

interface ToastPayload {
  type?: 'success' | 'error' | 'warn' | 'info';
  data?: {
    title?: string;
    msg?: string;
  };
}

@Component({
    selector: 'app-global-toasts',
    template: `
    <div class="global-toasts position-fixed" style="bottom: 10px; right: 10px; z-index: 1060;">
      @for (t of toasts(); track t.id) {
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
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})
export class GlobalToastsComponent {
  private readonly globalToasty = inject(GlobalToastyService);
  private idCounter = 0;
  
  private readonly _toasts = signal<ToastItem[]>([]);
  readonly toasts = this._toasts.asReadonly();

  constructor() {
    this.globalToasty.globalToastyHandled.pipe(
      takeUntilDestroyed()
    ).subscribe((value: ToastPayload) => {
      const data = value?.data ?? {};
      const toastType: 'success' | 'error' | 'warn' | 'info' = (value?.type || 'info') as 'success' | 'error' | 'warn' | 'info';
      
      const t: ToastItem = {
        id: ++this.idCounter,
        type: toastType,
        title: data.title,
        msg: data.msg
      };
      
      this._toasts.update(toasts => [...toasts, t]);
      
      // Разное время жизни для разных типов сообщений
      // Ошибки показываются дольше, чтобы пользователь успел их прочитать
      const timeout = t.type === 'error' ? 10000 :  // 10 секунд для ошибок
                      t.type === 'warn' ? 7000 :     // 7 секунд для предупреждений
                      5000;                          // 5 секунд для остальных
      setTimeout(() => this.remove(t.id), timeout);
    });
  }

  remove(id: number) {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  cssClass(t: ToastItem): string {
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
