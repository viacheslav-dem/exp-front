import {ControlValueAccessor} from "@angular/forms";
import { OnInit, Directive, input } from "@angular/core";

@Directive()
export class ControlComponent<T> implements OnInit, ControlValueAccessor {

  _value: T;
  readonly name = input<string>('unnamed_control_' + Math.random());
  readonly placeholder = input<string>('');
  readonly title = input<string>('');
  protected onTouchedCallbacks = [];
  protected onChangeCallbacks = [];
  protected debug: boolean;

  ngOnInit(): void {
  }

  prepareValue(): void {
  }

  get value(): T {
    return this._value;
  };

  set value(v: T) {
    if (v !== this._value) {
      this.log(v, 'call setter');
      this._value = v;
      this.onChangeCallbacks.forEach(f => f(v));
      this.onTouchedCallbacks.forEach(f => f());
    }
  }

  writeValue(value: T) {
    if (value !== this._value) {
      this.log(value, 'call write');
      this._value = value;
      // Вызываем prepareValue только если значение не null/undefined
      // или если компонент может обработать null
      this.prepareValue();
    }
  }

  registerOnChange(fn: (_: T) => void) {
    this.log(fn, 'registerOnChange');
    this.onChangeCallbacks.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this.log(fn, 'registerOnTouched');
    this.onTouchedCallbacks.push(fn);
  }

  log(data, msg?: string) {
    if (this.debug) {
      console.log(this, msg, data);
    }
  }
}
