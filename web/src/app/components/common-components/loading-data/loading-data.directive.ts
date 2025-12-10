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
    } else {
      if(this.spinnerBg){
        const host: HTMLElement = this.el.nativeElement;
        if (this.spinnerBg.parentNode === host) {
          host.removeChild(this.spinnerBg);
        }
      }
    }
  }
}
