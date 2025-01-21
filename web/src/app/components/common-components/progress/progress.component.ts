import {debounceTime} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {ProgressService} from "./progress.service";
import "rxjs/add/operator/debounceTime";

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html'
})
export class ProgressComponent implements OnInit {

  public loading: boolean = false;

  constructor(private _progress: ProgressService) {
  }

  ngOnInit() {
    //Expression Changed After It Has Been Checked Exception
    //Если запрос выполняется слишком быстро, то busy->true->false происходит за один "change detection turn".
    //В turn проверяется, что busy стал true -> обновляется view. Но в этом же turn busy становится false, а компонент ScreenBlock уже считается обновлённым.
    //Поэтому Expression Changed After It Has Been Checked Exception
    this._progress.showObservable.pipe(debounceTime(0)).subscribe(() => {
      this.loading = true;
    });

    this._progress.hideObservable.pipe(debounceTime(0)).subscribe(() => {
      this.loading = false;
    });
  }

}
