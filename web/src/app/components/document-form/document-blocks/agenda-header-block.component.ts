import {Component, HostListener, input, output} from '@angular/core';
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {DecisionStateBadge} from "@app/pipes/decision.pipe";
import {AgendaNewFormContent} from "@app/components/document-form/meeting-protocol-form/AgendaNewFormContent";

@Component({
    selector: 'app-agenda-header-block',
    template: `
    <label class="form-group-label mb-0 selectable"
           role="button"
           tabindex="0"
           [attr.aria-controls]="targetId()"
           [attr.aria-expanded]="expanded()">
      <span>{{ind() + 1}}. {{project() | titleAndCode}}</span>
      <span> | Решение:</span>
      <span class="ms-05" [ngClass]="['badge', DecisionStateBadge[_form().conclusion.getDecision()] || 'badge-info']">
        {{(_form().conclusion.getDecision() | decision) || 'не указано'}}
      </span>
    </label>
  `,
    standalone: false
})
export class AgendaHeaderBlockComponent {

  DecisionStateBadge = DecisionStateBadge;

  readonly ind = input<number>(undefined);

  readonly project = input<ProjectPlainDto>(undefined);

  readonly _form = input<AgendaNewFormContent>(undefined);

  readonly expanded = input<boolean>(false);

  readonly toggle = output<void>();

  targetId(): string {
    const id = this.project()?.id;
    return id != null ? `meeting-project-${id}` : '';
  }

  @HostListener('click')
  onClick() {
    // TODO: The 'emit' function requires a mandatory void argument
    this.toggle.emit();
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeydown(ev: KeyboardEvent) {
    ev.preventDefault();
    // TODO: The 'emit' function requires a mandatory void argument
    this.toggle.emit();
  }
}
