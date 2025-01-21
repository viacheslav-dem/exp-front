import {Injectable, Type} from "@angular/core";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";
import {CouncilConclusion_8_1_2_FormComponent} from "@app/components/document-form/council-conclusion-8-1-2-form/council-conclusion-8-1-2-form.component";
import {CouncilConclusion_8_3_4_5_7_8_12_15_FormComponent} from "@app/components/document-form/council-conclusion-8-3-4-5-7-8-12-15-form/council-conclusion-8-3-4-5-7-8-12-15-form.component";
import {CouncilConclusion_8_9_FormComponent} from "@app/components/document-form/council-conclusion-8-9-form/council-conclusion-8-9-form.component";
import {CouncilConclusion_8_10PVT_FormComponent} from "@app/components/document-form/council-conclusion-8-10PVT-form/council-conclusion-8-10PVT-form.component";
import {CouncilConclusion_8_10PIT_FormComponent} from "@app/components/document-form/council-conclusion-8-10PIT-form/council-conclusion-8-10PIT-form.component";
import {CouncilConclusion_8_11_14_FormComponent} from "@app/components/document-form/council-conclusion-8-11-14-form/council-conclusion-8-11-14-form.component";
import {CouncilConclusion_8_13_FormComponent} from "@app/components/document-form/council-conclusion-8-13-form/council-conclusion-8-13-form.component";
import {CouncilConclusion_8_6_FormComponent} from "@app/components/document-form/council-conclusion-8-6-form/council-conclusion-8-6-form.component";
import {
  CouncilConclusion_8_16_FormComponent
} from "@app/components/document-form/council-conclusion-8-16-form/council-conclusion-8-16-form.component";
import {
  CouncilConclusion_8_8BIF_FormComponent
} from "@app/components/document-form/council-conclusion-8-BIF-form/council-conclusion-8-8BIF-form.component";

@Injectable()
export class CouncilConclusionFormResolver {

  constructor() {
  }

  // noinspection JSMethodCanBeStatic
  getFormRenderer(code: string): Type<CouncilConclusionForm> {
    if (ProjectCodePlainDto.isCodeIn(code, 1, 2)) {
      return CouncilConclusion_8_1_2_FormComponent;
    } else if (ProjectCodePlainDto.isCode(code, 9)) {
      return CouncilConclusion_8_9_FormComponent;
    } else if (ProjectCodePlainDto.isCode(code, '10')) {
      return CouncilConclusion_8_10PVT_FormComponent;
    } else if (ProjectCodePlainDto.isCode(code, '10ПИТ')) {
      return CouncilConclusion_8_10PIT_FormComponent;
    } else if (ProjectCodePlainDto.isCodeIn(code, 11, 14)) {
      return CouncilConclusion_8_11_14_FormComponent;
    } else if (ProjectCodePlainDto.isCode(code, 13)) {
      return CouncilConclusion_8_13_FormComponent;
    } else if (ProjectCodePlainDto.isCode(code, 6)) {
      return CouncilConclusion_8_6_FormComponent
    } else if (ProjectCodePlainDto.isCode(code, 16)) {
      return CouncilConclusion_8_16_FormComponent
    } else if (ProjectCodePlainDto.isCode(code,'8БИФ')) {
      return CouncilConclusion_8_8BIF_FormComponent
    } else if (ProjectCodePlainDto.isCode(code,'8ЕАС')) {
      return CouncilConclusion_8_8BIF_FormComponent
    } else {
      return CouncilConclusion_8_3_4_5_7_8_12_15_FormComponent;
    }
  }
}
