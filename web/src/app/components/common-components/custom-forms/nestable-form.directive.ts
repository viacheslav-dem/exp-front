import {filter} from 'rxjs/operators';
import {
  Attribute,
  Directive,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  SkipSelf,
  input
} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, NgForm} from '@angular/forms';
import {Subject} from "rxjs";
import {GlobalToastyService} from "@app/services/global-toasty.service";

const resolvedPromise = Promise.resolve(null);

function isPrimitive(test) {
  return (test !== Object(test));
};

@Directive({
    selector: '[appNestableForm]',
    exportAs: "appNestableForm",
    standalone: false
})
//https://www.toptal.com/angular-js/angular-4-forms-validation
export class NestableFormDirective implements OnInit, OnDestroy {

  private static readonly FORM_ARRAY_NAME = 'CHILD_FORMS';

  //Хак для сложных вьюх, где много ng-content и всяких вложенностей.
  //Через ContentChildren и ViewChildren не получилось.
  //Основная проблема в том, что если мы выберем QueryList<A>,
  // то эти A должны идти непосредственно в данном template - искать глубже они не собираются.
  // А descendants:true для ContentChildren не работает.
  //Для Injector, parent Injector ситуация аналогичная.
  //
  //template:`
  // <app-edit-card [hasReadOnlyVersion]="true" [entityEditCardViewModel]="entityEditCardViewModel"
  //   *ngIf="selectedEntity">
  //
  //   <div entity-form-content>
  //      <app-assigned-scientific-degree [assigned_scientific_degree]="selectedEntity">
  //      </app-assigned-scientific-degree>
  //   </div>
  // </app-edit-card>
  //`
  //В таком примере appNestableForm внутри  app-assigned-scientific-degree не сможет найти родительскую appNestableForm.
  // Для неё родители - родители по построению, а не по результату компоновки вьюх.  appNestableForm есть в app-edit-card, но
  // непосредственно в template её нет.
  //
  //Так вот где-то приходится помечать компонент как appNestableForm, чтобы его мог найти потомок.
  //И этому формально помеченному компоненту нужно пропихнуть реальный appNestableForm, который учавствует в организации вложенности форм.
  //
  //Возможно, всё вышеописанное - догадки, а все проблемы из-за ngIf, который ломает последовательность lifecylce events
  readonly realAppNestableForm = input<NestableFormDirective>(undefined);

  readonly submitFunc = input<() => void>(undefined);

  public ngForm: NgForm;
  public rootForm: NgForm;

  public isRoot: boolean = false;

  childrenRegistration$: Subject<NestableFormDirective> = new Subject<NestableFormDirective>();

  rootSubmitEvent$: Subject<any> = new Subject<any>();

  lastFormControlsCount = 0;
  lastValueAsJson = "";

  // countFormControls(controlValue: any) {
  //   let formControlsCount = 0;
  //   if (isPrimitive(controlValue)) {
  //
  //   } else if (Array.isArray(controlValue)) {
  //     for (let val of controlValue) {
  //       formControlsCount += this.countFormControls(val);
  //     }
  //   } else {
  //     formControlsCount += Object.keys(controlValue).length;
  //     Object.keys(controlValue).forEach((key, index) => {
  //       formControlsCount += this.countFormControls(controlValue[key]);
  //     });
  //   }
  //   return formControlsCount;
  // }

  constructor(@Attribute('debugName') public debugName,
              @SkipSelf()
              @Optional()
              private parentForm: NestableFormDirective,
              @Attribute('isRoot') isRoot,
              private injector: Injector,
              public elRef: ElementRef, private renderer: Renderer2,
              private _toasty: GlobalToastyService) {
    // console.log(this.debugName, "CONSTRUCTOR", this);
    // console.log(this.debugName, "IS_ROOT", isRoot);
    this.isRoot = isRoot === "true" ? true : false;

    this.resolveCurrentForm();
    if (this.isRoot) {
      this.lastValueAsJson = JSON.stringify(this.ngForm.control.value);
      // this.ngForm.valueChanges.subscribe((v) => {
      //   console.log(v);
      // });
      this.ngForm.ngSubmit.subscribe((event) => {
        // this.ngForm.control.markAsDirty();
        this.markRecursively(this.ngForm.control, (control: AbstractControl) => control.markAsDirty());
        this.markRecursively(this.ngForm.control, (control: AbstractControl) => control.markAsTouched());
        // this.markAsTouchedRecursively(this.ngForm.control);

        // console.log("ngSubmit!!!!!!!!", this.ngForm);
        event.stopPropagation();
        if (this.ngForm.control.valid) {
          this.submitFunc()();
        } else {
          this._toasty.error("Пожалуйста, исправьте ошибки.")
        }
      });
    }

    //если нет ngForm, то это фиктивный NestableFormDirective c realAppNestableForm
    if (this.ngForm) {
      // console.log(this.debugName, "currentForm", this.currentForm);
      this.ngForm.control.addControl(NestableFormDirective.FORM_ARRAY_NAME, new FormArray([]));
      this.childrenRegistration$.subscribe(c => {
        (<FormArray>this.ngForm.control.get(NestableFormDirective.FORM_ARRAY_NAME)).push(c.ngForm.control);
      });
    }
  }

  markRecursively(control: AbstractControl, markFunction: (AbstractControl) => void) {
    if (control instanceof FormControl) {
      markFunction(control);
    } else if (control instanceof FormArray) {
      Object.keys(control.controls).forEach((key, index) => {
        this.markRecursively(control.controls[key], markFunction);
      });
    } else if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach((key, index) => {
        this.markRecursively(control.controls[key], markFunction);
      });
    }
  }

  ngOnInit() {
    // console.log(this.debugName, "ON_INIT");
    const realAppNestableForm = this.realAppNestableForm();
    if (!realAppNestableForm && !this.ngForm) {
      throw new Error(`${this} hasn't neither "realAppNestableForm" nor "ngForm in template"`);
    }

    if (!realAppNestableForm) {
      this.registerToParent();
      let root = this.getRootNestableForm();
      if (root) {
        this.rootForm = root.ngForm;
        // console.log("ROOT NOT NULL", this, root);

        this.rootSubmitEvent$ = this.rootForm.ngSubmit;
      }
    }
  }

  ngOnDestroy() {
    // console.log("ngOnDestroy", this.currentForm, this.parentForm, this.isRoot);
    if (!this.isRoot && !this.realAppNestableForm() && this.parentForm) {
      // this.executePostponed(() => this.parentForm.removeNestedForm(this));
      this.parentForm.removeNestedForm(this);
    }
  }

  public removeNestedForm(nestableForm: NestableFormDirective): void {
    const realAppNestableForm = this.realAppNestableForm();
    if (realAppNestableForm) {
      realAppNestableForm.removeNestedForm(nestableForm);
    } else {
      this.removeControl(nestableForm.ngForm.control);
    }
  }

  public registerNestedForm(nestableForm: NestableFormDirective): void {
    const realAppNestableForm = this.realAppNestableForm();
    if (realAppNestableForm) {
      realAppNestableForm.registerNestedForm(nestableForm);
    } else {
      // NOTE: prevent circular reference (adding to itself)
      if (nestableForm.ngForm === this.ngForm) {
        throw new Error('Trying to add itself! Nestable form can be added only on parent "NgForm" or "FormGroup".');
      }
      // console.log(nestableForm.debugName, "added registration to", this.debugName);
      this.childrenRegistration$.next(nestableForm);
    }
  }

  public removeControl(control: AbstractControl): void {
    const array = (<FormArray>this.ngForm.control.get(NestableFormDirective.FORM_ARRAY_NAME));
    const idx = array.controls.indexOf(control);
    array.removeAt(idx);
  }

  private resolveCurrentForm(): void {
    this.ngForm = this.injector.get(NgForm, null);
  }

  private registerToParent(): void {
    if (this.parentForm != null && !this.isRoot) {
      // console.log(this.debugName, "registering to parent", this.parentForm);
      this.parentForm.registerNestedForm(this);
    } else {
      // console.log(this.debugName, "hasnt parent or is root");
    }
  }

  public getRootNestableForm() {
    if (this.isRoot)
      return this;
    else {
      let parent = this.parentForm;
      const realAppNestableForm = parent.realAppNestableForm();
      if (parent && realAppNestableForm)
        parent = realAppNestableForm
      while (parent && !parent.isRoot) {
        parent = parent.parentForm;
        if (parent && realAppNestableForm)
          parent = realAppNestableForm
      }
      return parent;
    }
  }

  getDataValueChangesObservable() {
    return this.ngForm.valueChanges.pipe(filter((f) => {
      // console.log("this.rootForm.touched: ", this.rootForm.touched);
      // console.log("this.rootForm.dirty: ", this.rootForm.dirty);
      return this.rootForm.dirty;
    }));
  }

  //???
  private executePostponed(callback: () => void): void {
    resolvedPromise.then(() => callback());
  }

  public resetForm() {
    this.ngForm.resetForm();
    // console.log(this.ngForm.value);
  }
}
