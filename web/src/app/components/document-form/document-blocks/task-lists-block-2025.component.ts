import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-task-lists-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка перечня задач проекта, планируемый способ их реализации и обеспечение достижения поставленных целей проекта:
      </label>
      <app-dropdown
        name="taskLists"
        required
        [options]="taskListsOptions"
        [ngModel]="_form().taskLists"
        (ngModelChange)="emitPatch({ taskLists: $event })"
      ></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form().taskListsText"
          (ngModelChange)="emitPatch({ taskListsText: $event })"
          name="taskListsText"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)"
        ></textarea>
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

    readonly _form = input<TaskListsBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<TaskListsBlock2025Form>>();

    emitPatch(patch: Partial<TaskListsBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type TaskListsBlock2025Form = {
    taskLists: string;
    taskListsText: string;
};
