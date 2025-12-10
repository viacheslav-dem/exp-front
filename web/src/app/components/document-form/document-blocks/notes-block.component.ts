import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Text} from "@app/components/document-form/form-model/Text";

@Component({
    selector: 'app-notes-block',
    template: `
    <div class="form-group">
      <label class="form-group-label">Замечания эксперта</label>

      <div class="form-sub-group">
        <label>
          Замечания по материалам объекта госсударственной экспертизы, конкретные предложения о необходимости доработки и (или)
          корректировки материалов по объекту экспертизы:
        </label>
        <div *ngIf="_form.wrappedNotes.length == 0" class="mb-2 italic">не имеются</div>
        <div *ngFor="let note of _form.wrappedNotes; let i = index" class="input-group mb-2">
          <textarea [(ngModel)]="note.text" rows="2" class="form-control"
                    title="Замечание"
                    placeholder="{{i + 1}}) Замечание {{i + 1}}."></textarea>
          <div class="input-group-append">
            <button type="button" class="btn btn-outline-danger" (click)="deleteNote(i)">&times;</button>
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-sm" (click)="addNote()">
          Добавить замечание
        </button>
      </div>
    </div>
  `,
    standalone: false
})
export class NotesBlockComponent {

  @Input()
  _form: { wrappedNotes: Text[] };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  deleteNote(i) {
    this._form.wrappedNotes.splice(i, 1);
    this.onConditionsChanged.emit(true);
  }

  addNote() {
    this._form.wrappedNotes.push(new Text());
    this.onConditionsChanged.emit(true);
  }
}
