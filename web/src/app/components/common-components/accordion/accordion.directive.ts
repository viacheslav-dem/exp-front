import {Directive, ElementRef, Renderer, Input} from '@angular/core';

@Directive({
  selector: '[accordianShow]'
})
export class AccordionDirective {

  constructor(private el: ElementRef,private renderer: Renderer) {
    console.log('elements', el);
  }

  hide(){
    // this.el.nativeElement.style.display = "none";
    this.el.nativeElement.classList.remove('show');
  }

  show(){
    // this.el.nativeElement.style.display = "";
    this.el.nativeElement.classList.add('show');
  }

  @Input('accordianShow') set isShow(isShow: boolean){
    this.el.nativeElement.classList.add('accordion');
    isShow ? this.show() : this.hide();
  }

}
