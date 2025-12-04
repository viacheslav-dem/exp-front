import {CommonModule} from "@angular/common";
import {CustomPipesModule} from "@app/pipes/custom-pipes.module";
import {NgModule} from "@angular/core";
import {DocumentListComponent} from "./document-list/document-list.component";
import {FileEditorComponent} from "./file-editor/file-editor.component";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {ModalModule} from "ngx-bootstrap/modal";
import {PaginationModule} from "ngx-bootstrap/pagination";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CryptoModule} from "app/crypto/crypto.module";
import {PasswordInputComponent} from "app/components/common-components/password_input/password-input.component";
import {PasswordInputValidatorDirective} from "app/components/common-components/password_input/PasswordInputValidator";
import {CustomFormsModule} from "app/components/common-components/custom-forms/custom-forms.module";
import {DisabilityComponent} from './disability/disability.component';
import {PassportComponent} from './passport/passport.component';
import {BankAccountComponent} from './bank-account/bank-account.component';
import {DropdownComponent} from "app/components/common-components/dropdown/dropdown.component";
import {DropdownToggleDirective} from "app/components/common-components/dropdown/dropdown-toggle.directive";
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
import {BooleanButtonComponent} from './boolean-button/boolean-button.component';
import {FilterComponent} from "@app/components/common-components/page-and-filter/filter/filter.component";
import {PaginationComponent} from "@app/components/common-components/page-and-filter/pagination/pagination.component";
import {ChooseFilesComponent} from "@app/components/common-components/file-uploader/choose-files/choose-files.component";
import {SilentFileUploaderComponent} from "@app/components/common-components/file-uploader/silent-file-uploader/silent-file-uploader.component";
import {MonthYearComponent} from "@app/components/common-components/month-year/month-year.component";
import {SelectCatalogComponent} from './select-catalog/select-catalog.component';
import {DateInputComponent} from './date-input/date-input.component';
import {TimeInputComponent} from "@app/components/common-components/time-input/time-input.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import {NumberInputDirective} from "@app/components/common-components/number-input/number-input.directive";
import {BankAccountInputDirective} from "@app/components/common-components/bank-account/bank-account-input.directive";
import {BooleanButtonV2Component} from "@app/components/common-components/boolean-button/boolean-button-v2.component";
import {MethRecPdfComponent} from "@app/components/dialogs/meth-rec/meth-rec-pdf.component";
import {HighchartComponent} from "@app/components/highchart/highchart.component";
import {GlobalToastsComponent} from "@app/components/common-components/global-toasts/global-toasts.component";
import {PdfViewerModule} from "ng2-pdf-viewer";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomPipesModule,
    PaginationModule,
    BsDatepickerModule,
    ModalModule,
    CustomFormsModule,
    CollapseModule,
    CryptoModule,
    FontAwesomeModule,
    NgSelectModule,
    NgxSliderModule,
    PdfViewerModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomPipesModule,
    PaginationModule,
    BsDatepickerModule,
    ModalModule,
    CustomFormsModule,
    CollapseModule,
    FontAwesomeModule,
    NgSelectModule,
    NgxSliderModule,
    PdfViewerModule,
    DocumentListComponent,
    FileEditorComponent,
    PasswordInputComponent,
    IfRoleDirective,
    PasswordInputValidatorDirective,
    DisabilityComponent,
    PassportComponent,
    BankAccountComponent,
    DropdownComponent,
    DropdownToggleDirective,
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
    BankAccountInputDirective,
    BooleanButtonV2Component,
    MethRecPdfComponent,
    HighchartComponent,
    GlobalToastsComponent
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
    DropdownToggleDirective,
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
    BooleanButtonV2Component,
    ChooseFilesComponent,
    SilentFileUploaderComponent,
    MonthYearComponent,
    SelectCatalogComponent,
    DateInputComponent,
    TimeInputComponent,
    NumberInputDirective,
    BankAccountInputDirective,
    MethRecPdfComponent,
    HighchartComponent,
    GlobalToastsComponent
  ]
})
export class CommonComponentsModule {
}
