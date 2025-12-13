import {Component, EventEmitter, OnInit, Output, ViewChild, input} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Role} from "app/pipes/role.pipe";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {SearchExpertComponent} from "@app/components/search/search-person/search-expert/search-expert.component";
import {ExpertReviewDto} from "@app/dto/ExpertReviewDto";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PersonFullNamePipe} from "@app/pipes/person-full-name.pipe";
import {ProjectService} from "@app/services/project.service";

@Component({
    selector: 'app-expert-review-list',
    templateUrl: './expert-review-list.component.html',
    styleUrls: ['expert-review-list.component.scss'],
    standalone: false
})
export class ExpertReviewListComponent implements OnInit {

  Role = Role;

  readonly expertReviews = input<ExpertReviewDto[]>([]);
  readonly role = input<string>(undefined);
  readonly project = input<any>(undefined);
  @Output() onChanged: EventEmitter<any> = new EventEmitter<any>();
  readonly canChooseExperts = input<boolean>(undefined);

  @ViewChild(SearchExpertComponent, { static: false }) public searchExpertComponent: SearchExpertComponent;

  constructor(private route: ActivatedRoute,
              private _toasty: GlobalToastyService,
              private _projectService: ProjectService,
              private _dialogService: DialogService,
              private _personPipe: PersonFullNamePipe) {
  }

  ngOnInit() {
  }

  changed() {
    this.onChanged.emit(this.expertReviews());
  }

  onSelectedExpert(expert) {
    this.searchExpertComponent.hide();
    this._dialogService.showConfirmDialog(
      'Выбор эксперта',
      `Назначить эксперта "${this._personPipe.transform(expert)}" на объект экспертизы "${this.project().title}"?`,
      'Эксперт получит приглашение поучаствовать в экспертизе.'
    ).subscribe(() => {
      this._projectService.attachExpert(this.project(), expert.id).subscribe(res => {
        this._toasty.success("Эксперт прикреплен.");
        this.expertReviews().push(res);
        this.changed();
      })
    });
  }
}
