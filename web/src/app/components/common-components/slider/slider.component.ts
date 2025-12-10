import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from "@angular/core";
import {Options} from '@angular-slider/ngx-slider';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    standalone: false
})
export class SliderComponent implements OnInit, OnChanges {

  @Output() onChange = new EventEmitter();

  @Input()
  public slider: any;

  value: number = 0;
  highValue: number = 100;
  options: Options = {
    floor: 0,
    ceil: 100,
    step: 1
  };

  private timer: any;

  constructor() {
  }

  ngOnInit() {
    this.updateSlider();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['slider'] && !changes['slider'].firstChange) {
      this.updateSlider();
    }
  }

  private updateSlider() {
    if (this.slider) {
      this.value = this.slider.from !== undefined ? this.slider.from : this.slider.min || 0;
      this.highValue = this.slider.to !== undefined ? this.slider.to : this.slider.max || 100;
      
      this.options = {
        floor: this.slider.min || 0,
        ceil: this.slider.max || 100,
        step: this.slider.step || 1,
        ...this.slider.options
      };
    }
  }

  onUserChangeEnd(changeContext: any) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      const result = {
        from: this.value === this.options.floor ? null : this.value,
        to: this.highValue === this.options.ceil ? null : this.highValue
      };
      this.onChange.emit(result);
    }, 500);
  }

  onValueChange(value: number) {
    this.value = value;
  }

  onHighValueChange(highValue: number) {
    this.highValue = highValue;
  }
}
