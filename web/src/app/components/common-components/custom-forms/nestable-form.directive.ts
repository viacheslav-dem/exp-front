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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:150',message:'ngOnInit entry',data:{isRoot:this.isRoot,hasParentForm:!!this.parentForm,hasNgForm:!!this.ngForm,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    // console.log(this.debugName, "ON_INIT");
    const realAppNestableForm = this.realAppNestableForm();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:153',message:'realAppNestableForm result',data:{hasRealAppNestableForm:!!realAppNestableForm,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    if (!realAppNestableForm && !this.ngForm) {
      throw new Error(`${this} hasn't neither "realAppNestableForm" nor "ngForm in template"`);
    }

    if (!realAppNestableForm) {
      this.registerToParent();
      let root = this.getRootNestableForm();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:160',message:'getRootNestableForm result',data:{hasRoot:!!root,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
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
    // #region agent log
    console.error('[DEBUG] registerNestedForm entry', {hasNgForm: !!this.ngForm, debugName: this.debugName, nestableFormDebugName: nestableForm?.debugName});
    fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:195',message:'registerNestedForm entry',data:{hasNgForm:!!this.ngForm,debugName:this.debugName,nestableFormDebugName:nestableForm?.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const realAppNestableForm = this.realAppNestableForm();
    // #region agent log
    console.error('[DEBUG] registerNestedForm realAppNestableForm', {hasRealAppNestableForm: !!realAppNestableForm, debugName: this.debugName});
    fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:199',message:'registerNestedForm realAppNestableForm',data:{hasRealAppNestableForm:!!realAppNestableForm,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
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
    // #region agent log
    console.error('[DEBUG] registerToParent entry', {hasParentForm: !!this.parentForm, isRoot: this.isRoot, parentFormType: this.parentForm?.constructor?.name, debugName: this.debugName});
    fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:225',message:'registerToParent entry',data:{hasParentForm:!!this.parentForm,isRoot:this.isRoot,parentFormType:this.parentForm?.constructor?.name,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    if (this.parentForm != null && !this.isRoot) {
      // console.log(this.debugName, "registering to parent", this.parentForm);
      try {
        this.parentForm.registerNestedForm(this);
      } catch (e) {
        // #region agent log
        console.error('[DEBUG] ERROR in registerToParent.registerNestedForm', {error: e, hasParentForm: !!this.parentForm, parentFormType: this.parentForm?.constructor?.name, debugName: this.debugName});
        fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:231',message:'ERROR in registerToParent.registerNestedForm',data:{error:String(e),hasParentForm:!!this.parentForm,parentFormType:this.parentForm?.constructor?.name,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        throw e;
      }
    } else {
      // console.log(this.debugName, "hasnt parent or is root");
    }
  }

  public getRootNestableForm() {
    try {
      // #region agent log
      console.error('[DEBUG] getRootNestableForm entry', {isRoot: this.isRoot, hasParentForm: !!this.parentForm, parentFormType: this.parentForm?.constructor?.name, debugName: this.debugName});
      fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:237',message:'getRootNestableForm entry',data:{isRoot:this.isRoot,hasParentForm:!!this.parentForm,parentFormType:this.parentForm?.constructor?.name,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      if (this.isRoot)
        return this;
      else {
        let parent = this.parentForm;
        // #region agent log
        console.error('[DEBUG] getRootNestableForm parent check', {hasParent: !!parent, parentType: parent?.constructor?.name, parentIsRoot: parent?.isRoot, debugName: this.debugName});
        fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:244',message:'getRootNestableForm parent check',data:{hasParent:!!parent,parentType:parent?.constructor?.name,parentIsRoot:parent?.isRoot,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (!parent) {
          return null;
        }
        
        // #region agent log
        console.error('[DEBUG] BEFORE parent.realAppNestableForm() call', {hasParent: !!parent, parentType: parent?.constructor?.name, hasRealAppNestableFormMethod: typeof parent?.realAppNestableForm === 'function', debugName: this.debugName});
        fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:252',message:'BEFORE parent.realAppNestableForm() call',data:{hasParent:!!parent,parentType:parent?.constructor?.name,hasRealAppNestableFormMethod:typeof parent?.realAppNestableForm === 'function',debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        let realAppNestableForm;
        if (!parent || typeof parent.realAppNestableForm !== 'function') {
          // #region agent log
          console.error('[DEBUG] parent is null or realAppNestableForm is not a function', {hasParent: !!parent, parentType: parent?.constructor?.name, hasRealAppNestableFormMethod: typeof parent?.realAppNestableForm === 'function', debugName: this.debugName});
          fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:259',message:'parent is null or realAppNestableForm is not a function',data:{hasParent:!!parent,parentType:parent?.constructor?.name,hasRealAppNestableFormMethod:typeof parent?.realAppNestableForm === 'function',debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          realAppNestableForm = undefined;
        } else {
          try {
            realAppNestableForm = parent.realAppNestableForm();
          } catch (e) {
            // #region agent log
            console.error('[DEBUG] ERROR calling parent.realAppNestableForm()', {error: e, parent: parent, parentType: parent?.constructor?.name, hasParent: !!parent, debugName: this.debugName});
            fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:265',message:'ERROR calling parent.realAppNestableForm()',data:{error:String(e),parentType:parent?.constructor?.name,hasParent:!!parent,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            throw e;
          }
        }
        // #region agent log
        console.error('[DEBUG] AFTER parent.realAppNestableForm() call', {hasRealAppNestableForm: !!realAppNestableForm, realAppNestableFormType: realAppNestableForm?.constructor?.name, debugName: this.debugName});
        fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:262',message:'AFTER parent.realAppNestableForm() call',data:{hasRealAppNestableForm:!!realAppNestableForm,realAppNestableFormType:realAppNestableForm?.constructor?.name,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (realAppNestableForm) {
          parent = realAppNestableForm;
        }
        
        let iterationCount = 0;
        while (parent && !parent.isRoot) {
          iterationCount++;
          // #region agent log
          console.error('[DEBUG] while loop iteration start', {iteration: iterationCount, hasParent: !!parent, parentType: parent?.constructor?.name, parentIsRoot: parent?.isRoot, debugName: this.debugName});
          fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:267',message:'while loop iteration start',data:{iteration:iterationCount,hasParent:!!parent,parentType:parent?.constructor?.name,parentIsRoot:parent?.isRoot,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          parent = parent.parentForm;
          // #region agent log
          console.error('[DEBUG] after parent = parent.parentForm', {iteration: iterationCount, hasParent: !!parent, parentType: parent?.constructor?.name, debugName: this.debugName});
          fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:270',message:'after parent = parent.parentForm',data:{iteration:iterationCount,hasParent:!!parent,parentType:parent?.constructor?.name,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          if (parent && typeof parent.realAppNestableForm === 'function') {
            // #region agent log
            console.error('[DEBUG] BEFORE parent.realAppNestableForm() in loop', {iteration: iterationCount, hasParent: !!parent, parentType: parent?.constructor?.name, hasRealAppNestableFormMethod: typeof parent?.realAppNestableForm === 'function', debugName: this.debugName});
            fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:289',message:'BEFORE parent.realAppNestableForm() in loop',data:{iteration:iterationCount,hasParent:!!parent,parentType:parent?.constructor?.name,hasRealAppNestableFormMethod:typeof parent?.realAppNestableForm === 'function',debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            try {
              realAppNestableForm = parent.realAppNestableForm();
            } catch (e) {
              // #region agent log
              console.error('[DEBUG] ERROR calling parent.realAppNestableForm() in loop', {error: e, iteration: iterationCount, parent: parent, parentType: parent?.constructor?.name, hasParent: !!parent, debugName: this.debugName});
              fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:294',message:'ERROR calling parent.realAppNestableForm() in loop',data:{error:String(e),iteration:iterationCount,parentType:parent?.constructor?.name,hasParent:!!parent,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
              // #endregion
              throw e;
            }
          } else {
            // #region agent log
            console.error('[DEBUG] parent is null or realAppNestableForm is not a function in loop', {iteration: iterationCount, hasParent: !!parent, parentType: parent?.constructor?.name, hasRealAppNestableFormMethod: typeof parent?.realAppNestableForm === 'function', debugName: this.debugName});
            fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:300',message:'parent is null or realAppNestableForm is not a function in loop',data:{iteration:iterationCount,hasParent:!!parent,parentType:parent?.constructor?.name,hasRealAppNestableFormMethod:typeof parent?.realAppNestableForm === 'function',debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            realAppNestableForm = undefined;
          }
          // #region agent log
          console.error('[DEBUG] AFTER parent.realAppNestableForm() in loop', {iteration: iterationCount, hasRealAppNestableForm: !!realAppNestableForm, realAppNestableFormType: realAppNestableForm?.constructor?.name, debugName: this.debugName});
          fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:318',message:'AFTER parent.realAppNestableForm() in loop',data:{iteration:iterationCount,hasRealAppNestableForm:!!realAppNestableForm,realAppNestableFormType:realAppNestableForm?.constructor?.name,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          if (realAppNestableForm) {
            parent = realAppNestableForm;
          }
        }
        // #region agent log
        console.error('[DEBUG] getRootNestableForm exit', {hasParent: !!parent, parentType: parent?.constructor?.name, parentIsRoot: parent?.isRoot, debugName: this.debugName});
        fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:288',message:'getRootNestableForm exit',data:{hasParent:!!parent,parentType:parent?.constructor?.name,parentIsRoot:parent?.isRoot,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        return parent;
      }
    } catch (e) {
      // #region agent log
      console.error('[DEBUG] getRootNestableForm ERROR', {error: e, stack: e?.stack, debugName: this.debugName});
      fetch('http://127.0.0.1:7242/ingest/2abcff53-265d-4bcf-8b4c-f7c76f88ce93',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'nestable-form.directive.ts:292',message:'getRootNestableForm ERROR',data:{error:String(e),stack:e?.stack,debugName:this.debugName},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      throw e;
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
