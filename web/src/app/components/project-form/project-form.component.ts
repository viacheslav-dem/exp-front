import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Catalog, DataService} from "@app/services/data.service";
import {CatalogDto} from "@app/dto/CatalogDto";
import {PeriodDto} from "@app/dto/PeriodDto";
import {isEmptyOrNull} from "@app/support/utils";
import {PersonService} from "@app/services/person.service";
import {ProjectDto} from "@app/dto/ProjectDto";
import {FundingDto} from "@app/dto/FundingDto";
import {FundingTypePipe, getAllFundingType} from "@app/pipes/funding-type.pipe";
import {DirectionDto} from "@app/dto/DirectionDto";
import {SubDirectionDto} from "@app/dto/SubDirectionDto";


@Component({
  selector: 'app-project-form',
  templateUrl: 'project-form.component.html'
})
export class ProjectFormComponent implements OnInit {

  directions: DirectionDto[] = [];
  Catalog = Catalog;
  newDirection: DirectionDto;
  subDirection: SubDirectionDto;
  newSocialEconomicGoal: CatalogDto;
  funding: FundingDto = new FundingDto();
  allFundingType: string[] = getAllFundingType();
  fundingToString: Function;

  @Input() optionToString: Function;

  _project: ProjectDto;

  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  codes: any = [];
  customer: any;


  constructor(private viewContainerRef: ViewContainerRef,
              private _dataService: DataService,
              private _personService: PersonService,
              private _fundingPipe: FundingTypePipe) {
    this.fundingToString = finance => _fundingPipe.transform(finance);
  }

  ngOnInit() {
    this.getProjectCodes();
    this._personService.getCurrentPerson().subscribe(res => {
      this.customer = res;
    });
  }

  @Input() set project(project: ProjectDto) {
    if (!project) project = new ProjectDto();
    if (!project.period) project.period = new PeriodDto();
    this._project = project;
  }

  getProjectCodes() {
    this._dataService.getCatalog(Catalog.PROJECT_CODE).subscribe(res => this.codes = res)
  }

  selectCode(code) {
    this._project.code = code;
  }

  onSave() {
    this._project.directions = this.directions;
    for (let i = 0; i < this.directions.length; i++) {
      for (let j = 0; j < this.directions[i].subDirectionDtos.length; j++) {
        this._project.subDirections.push(this.directions[i].subDirectionDtos[j]);
      }
    }
    this.validate();
    if (!this.canAddSocialEconomicGoals()) {
      this._project.socialEconomicGoals = [];
    }
    this.save.emit(this._project);
  }

  validate() {
    if(this._project.code.expertReviewType == 'EXPERT_REVIEW_8_1_2_15_2025'){
      if (isEmptyOrNull(this._project.program)){
        throw 'Наименование программы (подпрограммы) не может быть пустым.';
      }
    }
    if (isEmptyOrNull(this._project.title)) {
      throw 'Наименование объекта экспертизы не может быть пустым.';
    }
    if (!this._project.code) {
      throw 'Пожалуйста, выберите код объекта экспертизы.';
    }
    if (isEmptyOrNull(this._project.executor)) {
      throw 'Пожалуйста, укажите исполнителей и соисполнителей объекта экспертизы.';
    }
    if (!this._project.code.code.startsWith('8.10')) {
      if (!this._project.period.start || !this._project.period.end) {
        throw 'Пожалуйста, укажите сроки реализации объекта экспертизы.';
      }
      if (this._project.period.start > this._project.period.end) {
        throw 'Дата начала не может быть больше даты окончания.';
      }
      if (!this._project.code.code.startsWith('8.16')) {
        if (this._project.directions.length == 0 && !this.canAddSocialEconomicGoals()) {
          throw 'Пожалуйста, укажите приоритетное направление научных исследований и (или) научно-технической деятельности.';
        }
        if (this._project.directions.length == 0 && this._project.socialEconomicGoals.length == 0 && this.canAddSocialEconomicGoals()) {
          throw 'Пожалуйста, укажите приоритетное направление научных исследований и (или) научно-технической деятельности ' +
          'или цель (приоритет) социально-экономического развития';
        }
      }
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  addDirection() {
      let flagDirection: boolean = false;
      let flagSubDirection: boolean = false;
      for (let i = 0; i < this.directions.length; i++) {
        let idDir = this.directions[i].id;
        let idNewDir = this.newDirection.id;
        if(idDir == idNewDir){
          flagDirection = true;
          let lenSubDir = this.directions[i].subDirectionDtos.length;
          let subDir = this.directions[i].subDirectionDtos;
          for (let j = 0; j < lenSubDir; j++) {
            let idSubDir = subDir[j].id;
            let idNewSubDir = this.subDirection.id;
            if(idSubDir === idNewSubDir){
              flagSubDirection = true;
              break;
            }
          }
          if(!flagSubDirection){
            let finishSubDir: SubDirectionDto = {...this.subDirection};
            this.directions[i].subDirectionDtos.push(finishSubDir);
          }
          flagSubDirection = false;
        }
      }
      if(!flagDirection){
        let finishDir: DirectionDto = {...this.newDirection};
        finishDir.subDirectionDtos = [];
        finishDir.subDirectionDtos.push(this.subDirection);
        this.directions.push(finishDir);
     }
      // this._project.directions.push(this.newDirection);
      // this._project.subDirections.push(this.subDirection);
      this.newDirection = null;
      this.subDirection = null;
      flagDirection = false;
    // }
  }

  addSocialEconomicGoal() {
    if (this.newSocialEconomicGoal) {
      this._project.socialEconomicGoals.push(this.newSocialEconomicGoal);
      this.newSocialEconomicGoal = null;
    }
  }

  canAddSocialEconomicGoals() {
    return this._project.code && this._project.code.code == '8.13';
  }

  addFunding() {
    if (this.funding.type == null) {
      throw 'Пожалуйста, укажите тип финансирования объекта экспертизы.';
    }
    if (this.funding.source == null) {
      throw 'Пожалуйста, укажите источник финансирования объекта экспертизы.';
    }
    if (this.funding.value == null) {
      throw  'Пожалуйста, укажите сумму финансирования объекта экспертизы';
    }
    if (this.funding.value <= 0) {
      throw 'Пожалуйста, укажите неотрицательную сумму финансирования объекта экспертизы.';
    }
    this._project.financing.push(this.funding);
    this.funding = new FundingDto();
  }

  // select(option: SubDirectionDto) {
  //   console.log(option);
  //   this.subDirection = option;
  // }

  getSubDirectionName() {
    return  this.newDirection.subDirectionDtos;
  }

  displayDirection(){
    return this.directions;
  }


  display(dir: DirectionDto, indexSubDir: number, indexDir) {
    dir.subDirectionDtos.splice(indexSubDir, 1);
    if(dir.subDirectionDtos.length == 0){
      this.directions.splice(indexDir, 1);
    }
    return dir.subDirectionDtos;
  }
}
