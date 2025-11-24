import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
  styles: [`
      .review:not(:last-child) {
          margin-bottom: 1rem;
      }
  `]
})
export class ExpertReviewListComponent implements OnInit {

  Role = Role;

  @Input() expertReviews: ExpertReviewDto[] = [];
  @Input() role: string;
  @Input() project: any;
  @Output() onChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() canChooseExperts: boolean;

  @ViewChild(SearchExpertComponent) public searchExpertComponent: SearchExpertComponent;

  constructor(private route: ActivatedRoute,
              private _toasty: GlobalToastyService,
              private _projectService: ProjectService,
              private _dialogService: DialogService,
              private _personPipe: PersonFullNamePipe) {
  }

  ngOnInit() {
  }

  changed() {
    this.onChanged.emit(this.expertReviews);
  }

  onSelectedExpert(expert) {
    console.log("review-list")
    this.searchExpertComponent.hide();
    this._dialogService.showConfirmDialog(
      'Выбор эксперта',
      `Назначить эксперта "${this._personPipe.transform(expert)}" на объект экспертизы "${this.project.title}"?`,
      'Эксперт получит приглашение поучаствовать в экспертизе.'
    ).subscribe(() => {
      this._projectService.attachExpert(this.project, expert.id).subscribe(res => {
        this._toasty.success("Эксперт прикреплен.");
        this.expertReviews.push(res);
        this.changed();
      })
    });
  }

  automaticExpertSelection() {
    this._projectService.automaticExpertSelection(this.project.id).subscribe(res => {
      console.log('automaticExpertSelection')
      console.log(res)
      console.log('------------------------')
    });
  }
}
