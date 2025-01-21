import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ListItem} from "@app/components/common-components/checkbox-list/checkbox-list";
import {isEmptyOrNull} from "@app/support/utils";

@Component({
  selector: 'app-project-copy',
  templateUrl: 'project-copy.component.html'
})


export class ProjectCopyComponent {

  _project: ProjectDto;
  docs: ListItem[] = [];
  selectedDocs = [];
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();


  @Input() set project(project: ProjectDto) {
    this.selectedDocs = [];
    if (!project) project = new ProjectDto();
    this._project = project;
    this.docs = [];
    this._project.documents.forEach(d => this.docs.push(new ListItem(d.name, d.id)));
  }

  onCancel() {
    this.cancel.emit();
  }

  onSave() {
    this._project.documents = this.selectedDocs;
    this.validate();
    this.save.emit(this._project);
  }

  validate() {
    if (isEmptyOrNull(this._project.title)) {
      throw 'Наименование объекта экспертизы не может быть пустым.';
    }
  }


}