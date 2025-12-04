import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlErrorMessagesComponent } from './control-error-messages/control-error-messages.component';
import { NestableFormDirective } from './nestable-form.directive';
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports:[
    ControlErrorMessagesComponent,
    NestableFormDirective,
  ],
  declarations: [
    ControlErrorMessagesComponent,
    NestableFormDirective,
  ]
})
export class CustomFormsModule { }
