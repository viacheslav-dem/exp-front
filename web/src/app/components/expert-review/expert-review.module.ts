import { NgModule } from '@angular/core';
import { ExpertReviewComponent } from './expert-review.component';
import { CommonComponentsModule } from '@app/components/common-components/components.module';
import { DocumentFormModule } from '@app/components/document-form/document-form.module';
import { TransitionHistoryModule } from '@app/components/transition-history/transition-history.module';

@NgModule({
  declarations: [
    ExpertReviewComponent
  ],
  imports: [
    CommonComponentsModule,
    DocumentFormModule,
    TransitionHistoryModule
  ],
  exports: [
    ExpertReviewComponent
  ]
})
export class ExpertReviewModule {
}

