import {Directive, ElementRef, Renderer, Input} from "@angular/core";
@Directive({ selector: '[loadingData]' })
export class LoadingDataDirective {
  private spinnerLocal:any;
  private spinnerBg: any;

  constructor(private el: ElementRef,private renderer: Renderer) {
  }

  @Input('loadingData') set isLoading(isLoading: boolean){
    if(isLoading) {
      this.renderer.setElementStyle(this.el.nativeElement, 'position', 'relative');
      // this.spinnerLocal = this.renderer.createElement(this.el.nativeElement, 'div');
      // this.renderer.setElementClass(this.spinnerLocal, 'spinner-local', true);
      this.spinnerBg = this.renderer.createElement(this.el.nativeElement, 'div');
      this.renderer.setElementClass(this.spinnerBg, 'spinner-bg', true);
      // let spinner = this.renderer.createElement(this.spinnerLocal, 'div');
      // this.renderer.setElementClass(spinner, 'spinner', true);
      // let bounce1 = this.renderer.createElement(spinner, 'div');
      // let bounce2 = this.renderer.createElement(spinner, 'div');
      // this.renderer.setElementClass(bounce1, 'double-bounce1', true);
      // this.renderer.setElementClass(bounce2, 'double-bounce2', true);
    } else {
      if(this.spinnerBg){
        // this.spinnerLocal.remove();
        this.el.nativeElement.removeChild(this.spinnerBg);
      }
    }
  }
}
