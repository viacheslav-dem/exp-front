import { debounceTime } from 'rxjs/operators';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ProgressService} from "./progress.service";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dialogs)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class ProgressComponent implements OnInit, OnDestroy {

  public loading: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private _progress: ProgressService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    //Expression Changed After It Has Been Checked Exception
    //Если запрос выполняется слишком быстро, то busy->true->false происходит за один "change detection turn".
    //В turn проверяется, что busy стал true -> обновляется view. Но в этом же turn busy становится false, а компонент ScreenBlock уже считается обновлённым.
    //Поэтому Expression Changed After It Has Been Checked Exception
    this.subscriptions.push(
      this._progress.showObservable.pipe(debounceTime(0)).subscribe(() => {
        this.loading = true;
        // Важно для OnPush/zoneless: событие пришло из observable
        this.cdr.markForCheck();
      }),
      this._progress.hideObservable.pipe(debounceTime(0)).subscribe(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

}
