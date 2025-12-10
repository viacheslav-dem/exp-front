import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-task-lists-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Оценка перечня задач проекта, планируемый способ их реализации и обеспечение достижения поставленных целей проекта:
      </label>
      <app-dropdown [options]="taskListsOptions" [(ngModel)]="_form.taskLists"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full) {
        <textarea [(ngModel)]="_form.taskListsText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
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

    @Input()
    num: string = "3.2";

    @Input()
    full: boolean = true;

    @Input()
    _form: { taskLists: string, taskListsText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
