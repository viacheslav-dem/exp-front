import { NgModule } from '@angular/core';
import { ExpertTransitionHistoryComponent } from './expert-transition-history/expert-transition-history.component';
import { ProjectTransitionHistoryComponent } from './project-transition-history/project-transition-history.component';
import { GroupTransitionHistoryComponent } from './group-transition-history/group-transition-history.component';
import { LifecycleTransitionHistoryComponent } from './lifecycle-transition-history/lifecycle-transition-history.component';
import { CommonComponentsModule } from '@app/components/common-components/components.module';

@NgModule({
  declarations: [
    ExpertTransitionHistoryComponent,
    ProjectTransitionHistoryComponent,
    GroupTransitionHistoryComponent,
    LifecycleTransitionHistoryComponent
  ],
  imports: [
    CommonComponentsModule
  ],
  exports: [
    ExpertTransitionHistoryComponent,
    ProjectTransitionHistoryComponent,
    GroupTransitionHistoryComponent,
    LifecycleTransitionHistoryComponent
  ]
})
export class TransitionHistoryModule {
}

