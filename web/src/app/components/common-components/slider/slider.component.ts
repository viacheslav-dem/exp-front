import {ChangeDetectionStrategy, Component, OnInit, OnChanges, SimpleChanges, input, output} from "@angular/core";
import {Options} from '@angular-slider/ngx-slider';
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.commonControls)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class SliderComponent implements OnInit, OnChanges {

  readonly onChange = output<{from: number | null, to: number | null}>();

  public readonly slider = input<any>(undefined);

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
    const slider = this.slider();
    if (slider) {
      this.value = slider.from !== undefined ? slider.from : slider.min || 0;
      this.highValue = slider.to !== undefined ? slider.to : slider.max || 100;
      
      this.options = {
        floor: slider.min || 0,
        ceil: slider.max || 100,
        step: slider.step || 1,
        ...slider.options
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
