import {ChangeDetectionStrategy, Component, EventEmitter, Output, effect, input, signal} from "@angular/core";
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
  readonly docs = signal<ListItem[]>([]);
  selectedDocs = [];
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  private _lastProjectRef: ProjectDto | undefined;

  readonly project = input<ProjectDto>(undefined);

  private readonly projectEffect = effect(() => {
    const project = this.project();
    if (Object.is(this._lastProjectRef, project)) {
      return;
    }
    this._lastProjectRef = project;

    this.selectedDocs = [];

    const effectiveProject = project ?? new ProjectDto();
    this._project = effectiveProject;

    const nextDocs: ListItem[] = [];
    (effectiveProject.documents ?? []).forEach(d => nextDocs.push(new ListItem(d.name, d)));
    this.docs.set(nextDocs);
  });

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