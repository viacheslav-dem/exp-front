import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from "@app/services/auth.service";

@Directive({
    selector: '[ifRole]',
    standalone: false
})
export class IfRoleDirective {
    constructor(private templateRef: TemplateRef<any>,
                private _authService: AuthService,
                private viewContainer: ViewContainerRef) {
    }

    @Input()
    set ifRole(roles: string[] | string) {
        if (this._authService.inRole(roles)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

}
