import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from "@angular/core";
import Timer = NodeJS.Timer;

declare let $;

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html'
})
export class SliderComponent implements OnInit {

  private timer: Timer;
  @Output() onChange = new EventEmitter();

  @Input()
  public set slider(slider: any) {
    if (slider) {
      let id = '_' + Math.random().toString(36).substr(2, 9);
      this.el.nativeElement.firstElementChild.id = id;
      slider.onChange =  ($event)=> {
        clearTimeout(this.timer);
        this.timer = setTimeout(()=> {
          console.log($event);
          let result = {
            from: $event.from == $event.min? null : $event.from,
            to: $event.to == $event.max? null : $event.to
          };
          this.onChange.emit(result);
        }, 500);
      }
      $(`#${id}`).ionRangeSlider(slider);
    }
  }

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
  }
}
