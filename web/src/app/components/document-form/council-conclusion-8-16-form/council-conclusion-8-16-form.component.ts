import {Component} from "@angular/core";
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";

@Component({
    selector: 'app-council-conclusion-8-16-form',
    templateUrl: './council-conclusion-8-16-form.component.html',
    standalone: false
})
export class CouncilConclusion_8_16_FormComponent extends CouncilConclusionForm {

    onConditionsChanged() {}

    validate() {
        super.validate();
    }
}
