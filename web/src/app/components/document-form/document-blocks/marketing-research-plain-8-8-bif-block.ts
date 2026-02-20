import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-marketing-research-8-8-plain-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Проведение маркетинговых и патентных исследований, их результаты:
      </label>
      <app-dropdown
        [options]="marketingResearchOptions"
        [ngModel]="_form()?.marketingResearch"
        (ngModelChange)="emitPatch({ marketingResearch: $event })"
        [attr.name]="'marketingResearch_8_8_' + num().split('.').join('_')"
        required
      ></app-dropdown>
    </div>
  `,
    standalone: false
})
export class MarketingResearchPlainBifBlockComponent {

  marketingResearchOptions: string[] = [
    'имеются',
    'не имеются',
  ];

  readonly num = input<string>("5");

  readonly full = input<boolean>(true);

  readonly _form = input<MarketingResearchPlainBifBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<MarketingResearchPlainBifBlockForm>>();

  emitPatch(patch: Partial<MarketingResearchPlainBifBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type MarketingResearchPlainBifBlockForm = {
  marketingResearch: string;
};
