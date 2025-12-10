import {Component, forwardRef, Input} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {VoteResults} from "@app/components/document-form/meeting-protocol-form/VoteResults";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

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
            <div class="col-md-4 pr-2">
              <div class="input-group input-group-sm">
                <input min="0" [max]="all - _value.rejected" numberInput type="text" class="form-control"
                  [(ngModel)]="_value.accepted" placeholder="проголосовали за" required>
                  <div class="input-group-append">
                    <div class="input-group-text">
                      за
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 pl-2 pr-2">
                <div class="input-group input-group-sm">
                  <input min="0" [max]="all - _value.accepted" numberInput type="text" class="form-control"
                    [(ngModel)]="_value.rejected" placeholder="проголосовали против" required>
                    <div class="input-group-append">
                      <div class="input-group-text">
                        против
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 pl-2">
                  <div class="input-group input-group-sm">
                    <input min="0" disabled numberInput type="text" class="form-control" [value]="all - _value.getVoted()"
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
    standalone: false
})
export class VoteResultsComponent extends ControlComponent<VoteResults> {

  @Input() all: number;
  @Input()
  display: boolean = false;
}
