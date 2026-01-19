import {Directive, ElementRef, effect, input} from '@angular/core';

@Directive({
    selector: '[accordianShow]',
    standalone: false
})
export class AccordionDirective {

  constructor(private el: ElementRef) {
  }

  hide(){
    // this.el.nativeElement.style.display = "none";
    this.el.nativeElement.classList.remove('show');
  }

  show(){
    // this.el.nativeElement.style.display = "";
    this.el.nativeElement.classList.add('show');
  }

  readonly isShow = input<boolean>(false, { alias: 'accordianShow' });
  private readonly _isShowEffect = effect(() => {
    const isShow = this.isShow();
    this.el.nativeElement.classList.add('accordion');
    isShow ? this.show() : this.hide();
  });

}
