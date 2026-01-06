import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-construction-work-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Необходимость осуществления работ в сфере строительной деятельности. Возведение, реконструкция,
        реставрация, капитальный ремонт, техническая модернизация зданий и сооружений, их благоустройство:
      </label>
      <input type="hidden" [(ngModel)]="_form().constructionWorks" name="constructionWorks" required>
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-success" [ngClass]="{'active': _form().constructionWorks === true}" (click)="stateButton(true)">
          Требуется
        </button>
        <button type="button" class="btn btn-outline-danger" [ngClass]="{'active': _form().constructionWorks === false}" (click)="stateButton(false)">
          Не требуется
        </button>
      </div>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().constructionWorksText"
          [attr.name]="'constructionWorksText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
    
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Эксперт из представленных материалов объекта государственной экспертизы делает вывод о наличии информации о реализации проекта
            на имеющихся площадях либо на площадях, требующих возведение зданий и сооружений, реконструкцию, реставрацию, капитальный ремонт,
            техническую модернизацию, благоустройство. Если в материалах по объекту государственной экспертизы отсутствует соответствующая информация,
            эксперт должен указать в данном пункте заключения фразу: «не представлено в материалах по объекту государственной экспертизы»
            и дать свою экспертную оценку по данному вопросу.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ConstructionWorkBlock2025Component {

    readonly num = input<string>("3");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    constructionWorks: boolean;
    constructionWorksText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    stateButton(flag: boolean){
        if(flag){
            this._form().constructionWorks = true;
        } else {
            this._form().constructionWorks = false;
        }
    }
}