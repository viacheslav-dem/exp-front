import {ModuleWithProviders, NgModule, Optional, SkipSelf} from "@angular/core";
import {UserFormComponent} from "@app/components/dialogs/user-form/user-form.component";
import {CommonComponentsModule} from "@app/components/common-components/components.module";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {DialogComponent} from './dialog.component';
import {LoginCreateComponent} from './user-form/login-create.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ConfirmDialogComponent} from "@app/components/dialogs/confirm-dialog/confirm-dialog.component";
import {CustomPipesModule} from "@app/pipes/custom-pipes.module";


@NgModule({
  imports: [
    CommonComponentsModule,
    CustomPipesModule
  ],
  exports: [
    DialogComponent,
  ],
  declarations: [
    UserFormComponent,
    DialogComponent,
    LoginCreateComponent,
    ChangePasswordComponent,
    ConfirmDialogComponent,
  ]
})
export class DialogModule {
  constructor(@Optional() @SkipSelf() parentModule: DialogModule) {
    if (parentModule) {
      throw new Error(
        'DialogModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders<DialogModule> {
    return {
      ngModule: DialogModule,
      providers: [
        DialogService
      ]
    };
  }
}
