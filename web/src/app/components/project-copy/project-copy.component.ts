import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from "@angular/core";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ListItem} from "@app/components/common-components/checkbox-list/checkbox-list";
import {isEmptyOrNull} from "@app/support/utils";
import {environment} from "../../../environments/environment";
import {NumberPipe} from "@app/pipes/number.pipe";

@Component({
    selector: 'app-project-copy',
    templateUrl: 'project-copy.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})


export class ProjectCopyComponent {

  _project: ProjectDto;
  docs: ListItem[] = [];
  selectedDocs = [];
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) {
  }

  @Input() set project(project: ProjectDto) {
    this.selectedDocs = [];
    if (!project) project = new ProjectDto();
    this._project = project;
    this.docs = [];
    this._project.documents.forEach(d => this.docs.push(new ListItem(d.name, d.id)));
    this.cdr?.markForCheck?.();
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

  /**
   * В шаблоне нельзя использовать `| number`, потому что в scope одновременно попадают:
   * - встроенная Angular pipe `number` (DecimalPipe из CommonModule)
   * - наша кастомная `NumberPipe` с тем же именем `number` (из CustomPipesModule)
   * Это вызывает NG0313.
   *
   * Используем кастомный форматтер напрямую (без шаблонного pipe), фикс локальный и обратимый.
   */
  formatNumber(value: number | null | undefined, precision?: number, sign?: boolean): string | null {
    return NumberPipe.transform(value as number, precision, sign);
  }


}