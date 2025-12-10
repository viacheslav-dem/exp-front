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
      <div *ngFor="let t of toasts" class="alert" [ngClass]="cssClass(t)" role="alert">
        <strong *ngIf="t.title">{{ t.title }}</strong>
        <span *ngIf="t.msg"> {{ t.msg }}</span>
      </div>
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
      setTimeout(() => this.remove(t.id), 5000);
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
