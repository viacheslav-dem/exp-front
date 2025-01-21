import {CommonModule} from "@angular/common";
import {CustomPipesModule} from "@app/pipes/custom-pipes.module";
import {NgModule} from "@angular/core";
import {DocumentListComponent} from "./document-list/document-list.component";
import {FileEditorComponent} from "./file-editor/file-editor.component";
import {BsDatepickerModule, CollapseModule, ModalModule, PaginationModule} from "ngx-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CryptoModule} from "app/crypto/crypto.module";
import {PasswordInputComponent} from "app/components/common-components/password_input/password-input.component";
import {PasswordInputValidatorDirective} from "app/components/common-components/password_input/PasswordInputValidator";
import {CustomFormsModule} from "app/components/common-components/custom-forms/custom-forms.module";
import {DisabilityComponent} from './disability/disability.component';
import {PassportComponent} from './passport/passport.component';
import {BankAccountComponent} from './bank-account/bank-account.component';
import {DropdownComponent} from "app/components/common-components/dropdown/dropdown.component";
import {IfRoleDirective} from "@app/components/common-components/if-role/if-role.directive";
import {NumberRangeComponent} from "@app/components/common-components/number-range/number-range.component";
import {DatePeriodComponent} from "@app/components/common-components/date-period/date-period.component";
import {DocumentUploaderComponent} from "@app/components/common-components/file-uploader/document-uploader/document-uploader.component";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {PdfViewerComponent} from "@app/components/common-components/pdf-viewer/pdf-viewer.component";
import {CheckBoxListComponent} from "@app/components/common-components/checkbox-list/checkbox-list";
import {AccordionDirective} from "@app/components/common-components/accordion/accordion.directive";
import {LoadingDataDirective} from "@app/components/common-components/loading-data/loading-data.directive";
import {CheckboxComponent} from "@app/components/common-components/checkbox/checkbox.component";
import {ProgressComponent} from "@app/components/common-components/progress/progress.component";
import {SliderComponent} from "@app/components/common-components/slider/slider.component";
import {HttpModule} from "@angular/http";
import {Ng2CompleterModule} from "ng2-completer";
import {BooleanButtonComponent} from './boolean-button/boolean-button.component';
import {FilterComponent} from "@app/components/common-components/page-and-filter/filter/filter.component";
import {PaginationComponent} from "@app/components/common-components/page-and-filter/pagination/pagination.component";
import {AngularMultiSelectModule} from "angular2-multiselect-dropdown";
import {ChooseFilesComponent} from "@app/components/common-components/file-uploader/choose-files/choose-files.component";
import {SilentFileUploaderComponent} from "@app/components/common-components/file-uploader/silent-file-uploader/silent-file-uploader.component";
import {MonthYearComponent} from "@app/components/common-components/month-year/month-year.component";
import {SelectCatalogComponent} from './select-catalog/select-catalog.component';
import {DateInputComponent} from './date-input/date-input.component';
import {TimeInputComponent} from "@app/components/common-components/time-input/time-input.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NumberInputDirective} from "@app/components/common-components/number-input/number-input.directive";
import {BankAccountInputDirective} from "@app/components/common-components/bank-account/bank-account-input.directive";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CustomPipesModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    CustomFormsModule,
    HttpModule,
    CollapseModule,
    CryptoModule,
    AngularMultiSelectModule,
    FontAwesomeModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomPipesModule,
    PaginationModule,
    ModalModule,
    CustomFormsModule,
    CollapseModule,
    Ng2CompleterModule,
    AngularMultiSelectModule,
    FontAwesomeModule,
    DocumentListComponent,
    FileEditorComponent,
    PasswordInputComponent,
    IfRoleDirective,
    PasswordInputValidatorDirective,
    DisabilityComponent,
    PassportComponent,
    BankAccountComponent,
    DropdownComponent,
    DatePeriodComponent,
    NumberRangeComponent,
    FilterComponent,
    DocumentUploaderComponent,
    ModalComponent,
    PdfViewerComponent,
    CheckBoxListComponent,
    AccordionDirective,
    LoadingDataDirective,
    CheckboxComponent,
    PaginationComponent,
    ProgressComponent,
    SliderComponent,
    BooleanButtonComponent,
    ChooseFilesComponent,
    SilentFileUploaderComponent,
    MonthYearComponent,
    SelectCatalogComponent,
    DateInputComponent,
    TimeInputComponent,
    NumberInputDirective,
    BankAccountInputDirective
  ],
  declarations: [
    DocumentListComponent,
    FileEditorComponent,
    PasswordInputComponent,
    IfRoleDirective,
    PasswordInputValidatorDirective,
    DisabilityComponent,
    PassportComponent,
    BankAccountComponent,
    DropdownComponent,
    DatePeriodComponent,
    NumberRangeComponent,
    FilterComponent,
    DocumentUploaderComponent,
    ModalComponent,
    PdfViewerComponent,
    CheckBoxListComponent,
    AccordionDirective,
    LoadingDataDirective,
    CheckboxComponent,
    PaginationComponent,
    ProgressComponent,
    SliderComponent,
    BooleanButtonComponent,
    ChooseFilesComponent,
    SilentFileUploaderComponent,
    MonthYearComponent,
    SelectCatalogComponent,
    DateInputComponent,
    TimeInputComponent,
    NumberInputDirective,
    BankAccountInputDirective
  ]
})
export class CommonComponentsModule {
}
