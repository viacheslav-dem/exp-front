import {EventEmitter, Injectable} from "@angular/core";

@Injectable()
export class ChartService {

  resizeEvent = new EventEmitter();

  updateCharts() {
    this.resizeEvent.emit(true);
  }
}
