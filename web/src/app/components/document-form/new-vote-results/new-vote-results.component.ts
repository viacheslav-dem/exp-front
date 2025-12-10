import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {NewVoteResults} from "@app/components/document-form/meeting-protocol-form/NewVoteResults";
import {DecisionPipe, getAllDecisionStates} from "@app/pipes/decision.pipe";

export const NEW_VOTE_RESULTS_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NewVoteResultsComponent),
  multi: true
};

@Component({
    selector: 'app-new-vote-results',
    template: `
    @if (_value) {
      <div>
        <label><i><b>Результаты голосования</b></i></label>
        <div class="row">
          <div class="col-md-3 pr-2">
            <div class="input-group input-group-sm">
              <input min="0" numberInput type="text" class="form-control"
                [(ngModel)]="_value.accepted" (ngModelChange)="onChanged.emit(_value)" required>
                <div class="input-group-append">
                  <div class="input-group-text">
                    за
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3 pl-2 pr-2">
              <div class="input-group input-group-sm">
                <input min="0" numberInput type="text" class="form-control"
                  [(ngModel)]="_value.rejected" (ngModelChange)="onChanged.emit(_value)" required>
                  <div class="input-group-append">
                    <div class="input-group-text">
                      против
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 pl-2 pr-2">
                <div class="input-group input-group-sm">
                  <input min="0" numberInput type="text" class="form-control"
                    [(ngModel)]="_value.rescheduled" (ngModelChange)="onChanged.emit(_value)" required>
                    <div class="input-group-append">
                      <div class="input-group-text">
                        на доработку
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-3 pl-2">
                  <div class="input-group input-group-sm">
                    <input min="0" disabled numberInput type="text" class="form-control" [value]="all - _value.getVoted()"
                      required>
                      <div class="input-group-append">
                        <div class="input-group-text">
                          не голосовали
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-2">
                  <span [class.disabled]="_value.chairmanDecisionDisabled()">
                    Решение председателя заседания:
                  </span>
                  <span class="ml-05">
                    <app-dropdown class="d-inline-block"
                      [options]="decisionOptions"
                      [(ngModel)]="_value.chairmanDecision"
                      [disabled]="_value.chairmanDecisionDisabled()"
                      [optionToString]="decisionToString"
                    (ngModelChange)="onChanged.emit(_value)"></app-dropdown>
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
    providers: [NEW_VOTE_RESULTS_CONTROL_VALUE_ACCESSOR],
    standalone: false
})
export class NewVoteResultsComponent extends ControlComponent<NewVoteResults> {

  decisionOptions = getAllDecisionStates();
  decisionToString = d => d;

  @Input()
  all: number;

  @Output()
  onChanged: EventEmitter<NewVoteResults> = new EventEmitter<NewVoteResults>();

  constructor(private _decisionPipe: DecisionPipe) {
    super();
    this.decisionToString = d => _decisionPipe.transform(d);
  }

  prepareValue() {
    // clone to use NewVoteResults methods
    this.value = NewVoteResults.clone(this._value || new NewVoteResults());
  }
}
