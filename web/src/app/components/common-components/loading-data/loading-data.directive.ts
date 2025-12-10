import {Directive, ElementRef, Input} from "@angular/core";
@Directive({
    selector: '[loadingData]',
    standalone: false
})
export class LoadingDataDirective {
  private spinnerLocal:any;
  private spinnerBg: any;

  constructor(private el: ElementRef) {
  }

  @Input('loadingData') set isLoading(isLoading: boolean){
    if(isLoading) {
      const host: HTMLElement = this.el.nativeElement;
      host.style.position = 'relative';

      this.spinnerBg = document.createElement('div');
      this.spinnerBg.classList.add('spinner-bg');
      host.appendChild(this.spinnerBg);

      this.spinnerLocal = document.createElement('div');
      this.spinnerLocal.classList.add('spinner-local');
      const spinner = document.createElement('div');
      spinner.classList.add('spinner');
      const bounce1 = document.createElement('div');
      bounce1.classList.add('double-bounce1');
      const bounce2 = document.createElement('div');
      bounce2.classList.add('double-bounce2');
      spinner.appendChild(bounce1);
      spinner.appendChild(bounce2);
      this.spinnerLocal.appendChild(spinner);
      host.appendChild(this.spinnerLocal);
    } else {
      if(this.spinnerBg){
        const host: HTMLElement = this.el.nativeElement;
        if (this.spinnerBg.parentNode === host) {
          host.removeChild(this.spinnerBg);
        }
      }
      if(this.spinnerLocal){
        const host: HTMLElement = this.el.nativeElement;
        if (this.spinnerLocal.parentNode === host) {
          host.removeChild(this.spinnerLocal);
        }
      }
    }
  }
}
