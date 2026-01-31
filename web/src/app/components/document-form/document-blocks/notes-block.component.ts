import {Component, input, output} from '@angular/core';
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
        @if (_form().wrappedNotes.length == 0) {
          <div class="mb-2 italic">не имеются</div>
        }
        @for (note of _form()?.wrappedNotes || []; track $index; let i = $index) {
          <div class="input-group mb-2">
            <textarea [ngModel]="note.text" (ngModelChange)="updateNoteText(i, $event)" [attr.name]="'note_' + i" rows="2" class="form-control"
              title="Замечание"
              maxlength="5000"
            placeholder="{{i + 1}}) Замечание {{i + 1}}."></textarea>
            <div class="input-group-append">
              <button type="button" class="btn btn-outline-danger" (click)="deleteNote(i)">&times;</button>
            </div>
          </div>
        }
        <button type="button" class="btn btn-primary btn-sm" (click)="addNote()">
          Добавить замечание
        </button>
      </div>
    </div>
    `,
    standalone: false
})
export class NotesBlockComponent {

  readonly _form = input<NotesBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<NotesBlockForm>>();

  emitPatch(patch: Partial<NotesBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }

  deleteNote(i: number) {
    const currentNotes = this._form()?.wrappedNotes || [];
    const newNotes = currentNotes.filter((_, index) => index !== i);
    this.emitPatch({ wrappedNotes: newNotes });
  }

  addNote() {
    const currentNotes = this._form()?.wrappedNotes || [];
    this.emitPatch({ wrappedNotes: [...currentNotes, new Text()] });
  }

  updateNoteText(i: number, text: string) {
    const currentNotes = this._form()?.wrappedNotes || [];
    const newNotes = currentNotes.map((note, index) => 
      index === i ? new Text(text) : note
    );
    this.emitPatch({ wrappedNotes: newNotes });
  }
}

type NotesBlockForm = {
  wrappedNotes: Text[];
};
