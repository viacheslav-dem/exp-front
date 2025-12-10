import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'number',
    standalone: false
})
export class NumberPipe implements PipeTransform {

  transform(value: number, precision?: number, sign?: boolean): any {
    return NumberPipe.transform(value, precision, sign);
  }

  static transform(value: number, precision?: number, sign?: boolean): any {
    if (value == null || isNaN(value) || value == Infinity) {
      return null;
    }
    let res: string = value.toString();

    // precision
    if (precision) {
      res = value.toFixed(precision);
      while (res.indexOf('.') != -1 && res[res.length - 1] == '0' || res[res.length - 1] == '.') {
        res = res.substring(0, res.length - 1);
      }
    }

    // +
    if (sign && value > 0) {
      res = "+" + res;
    }

    // spaces
    let parts = res.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    res = parts.join(".");

    return res;
  }
}
