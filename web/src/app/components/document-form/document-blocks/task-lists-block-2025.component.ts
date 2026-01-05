import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-task-lists-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка перечня задач проекта, планируемый способ их реализации и обеспечение достижения поставленных целей проекта:
      </label>
      <app-dropdown name="taskLists" required [options]="taskListsOptions" [(ngModel)]="_form().taskLists"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea [(ngModel)]="_form().taskListsText" name="taskListsText" required minlength="30" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)"></textarea>
      }
    </div>
    `,
    standalone: false
})
export class TaskListsBlock2025Component {

    taskListsOptions: string[] = [
        'достаточна',
        'недостаточна',
    ];

    readonly num = input<string>("3.2");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    taskLists: string;
    taskListsText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
