import {Component, forwardRef, input, ChangeDetectionStrategy, effect} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {VoteResults} from "@app/components/document-form/meeting-protocol-form/VoteResults";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {environment} from "../../../../environments/environment";

export const VOTE_RESULTS_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VoteResultsComponent),
  multi: true
};

@Component({
    selector: 'app-vote-results',
    template: `
      @if (_value) {
        <div [class.d-none]="!display">
          <label><i>Результаты голосования</i></label>
          <div class="row">
            <div class="col-md-4 pe-2">
              <div class="input-group input-group-sm">
                <input min="0" [max]="all() - _value.rejected" numberInput type="text" class="form-control"
                  [(ngModel)]="_value.accepted" placeholder="проголосовали за" required>
                  <div class="input-group-append">
                    <div class="input-group-text">
                      за
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 ps-2 pe-2">
                <div class="input-group input-group-sm">
                  <input min="0" [max]="all() - _value.accepted" numberInput type="text" class="form-control"
                    [(ngModel)]="_value.rejected" placeholder="проголосовали против" required>
                    <div class="input-group-append">
                      <div class="input-group-text">
                        против
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 ps-2">
                  <div class="input-group input-group-sm">
                    <input min="0" disabled numberInput type="text" class="form-control" [value]="all() - _value.getVoted()"
                      placeholder="не участвовали в голосовании" required>
                      <div class="input-group-append">
                        <div class="input-group-text">
                          не голосовали
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-2">
                  <span [class.disabled]="_value.accepted != _value.rejected">
                    "За" и "против" равны, решение председателя заседания:
                  </span>
                  <span>
                    <app-boolean-button [disabled]="_value.accepted != _value.rejected"
                      [(ngModel)]="_value.isAcceptedByChairman" [trueLabel]="'за'"
                    [falseLabel]="'против'"></app-boolean-button>
                  </span>
                </div>
              </div>
            }
      `,
    styles: [`
      span.disabled {
          color: #bbbbbb;
      }
    
  `],
    providers: [VOTE_RESULTS_CONTROL_VALUE_ACCESSOR],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.meetings)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class VoteResultsComponent extends ControlComponent<VoteResults> {

  readonly all = input<number>(undefined);
  readonly displayInput = input<boolean>(false);
  readonly displaySignal = input<boolean | null>(null, { alias: 'display' });
  _display: boolean | null = null;

  private readonly displayEffect = effect(() => {
    this._display = this.displaySignal();
  });

  get display(): boolean {
    return this._display !== null ? this._display : this.displayInput();
  }

  set display(value: boolean) {
    this._display = value;
  }
}
