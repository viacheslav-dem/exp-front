import {Directive, TemplateRef, ViewContainerRef, effect, input} from '@angular/core';
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

    readonly ifRole = input<string[] | string>([]);
    private readonly _ifRoleEffect = effect(() => {
        const roles = this.ifRole();
        this.viewContainer.clear();
        if (this._authService.inRole(roles)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    });

}
