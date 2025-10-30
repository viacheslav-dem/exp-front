import {Injectable, Type} from "@angular/core";
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";
import {Agenda_8_6_NewFormComponent} from "@app/components/document-form/agenda-8-6-new-form/agenda-8-6-new-form.component";
import {Agenda_8_9_NewFormComponent} from "@app/components/document-form/agenda-8-9-new-form/agenda-8-9-new-form.component";
import {Agenda_8_10PVT_NewFormComponent} from "@app/components/document-form/agenda-8-10PVT-new-form/agenda-8-10PVT-new-form.component";
import {Agenda_8_10PIT_NewFormComponent} from "@app/components/document-form/agenda-8-10PIT-new-form/agenda-8-10PIT-new-form.component";
import {Agenda_8_13_NewFormComponent} from "@app/components/document-form/agenda-8-13-new-form/agenda-8-13-new-form.component";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {
  Agenda_8_16_NewFormComponent
} from "@app/components/document-form/agenda-8-16-new-form/agenda-8-16-new-form.component";
import {
  Agenda_8_1_2_3_4_5_7_8_12NIOKTR_14_2025_FormComponent
} from "@app/components/document-form/agenda-8-1-2-3-4-5-7-8-12NIOKTR-14-2025-form/agenda-8-1-2-3-4-5-7-8-12NIOKTR-14-2025-form";
import {
  Agenda_8_12IP_2025FormComponent
} from "@app/components/document-form/agenda-8-12IP-2025-form/agenda-8-12IP-2025-form.component";
import {
  Agenda_8_15_2025FormComponent
} from "@app/components/document-form/agenda-8-15-2025-form/agenda-8-15-2025-form.component";

@Injectable()
export class AgendaFormResolver {

  constructor() {
  }

  // noinspection JSMethodCanBeStatic
  getFormRenderer(code: string): Type<AgendaNewForm> {
    if (ProjectCodePlainDto.isCode(code, '12ИП')) {
      return Agenda_8_12IP_2025FormComponent;
    } else if (ProjectCodePlainDto.isCodeIn(code, 1, 2, 3, 4, 5, 7, 8, 12, 14)) {
      return Agenda_8_1_2_3_4_5_7_8_12NIOKTR_14_2025_FormComponent;
    } else if (ProjectCodePlainDto.isCode(code, 6)) {
      return Agenda_8_6_NewFormComponent;
    } else if (ProjectCodePlainDto.isCode(code, 9)) {
      return Agenda_8_9_NewFormComponent;
    } else if (ProjectCodePlainDto.isCode(code, '10')) {
      return Agenda_8_10PVT_NewFormComponent;
    } else if (ProjectCodePlainDto.isCode(code, '10ПИТ')) {
      return Agenda_8_10PIT_NewFormComponent;
    } else if (ProjectCodePlainDto.isCode(code, 13)) {
      return Agenda_8_13_NewFormComponent;
    } else if (ProjectCodePlainDto.isCode(code, 16)) {
      return Agenda_8_16_NewFormComponent;
    } else {
      return Agenda_8_15_2025FormComponent;
    }
  }
}
