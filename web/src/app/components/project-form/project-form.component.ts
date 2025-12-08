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
import {ExpectedResultDto} from "@app/dto/ExpectedResultDto";


@Component({
    selector: 'app-project-form',
    templateUrl: 'project-form.component.html'
})
export class ProjectFormComponent implements OnInit {

    @Input() optionToString: Function;

    @Output() save = new EventEmitter();
    @Output() cancel = new EventEmitter();

    directions: DirectionDto[] = [];
    Catalog = Catalog;
    newDirection: DirectionDto;
    subDirection: SubDirectionDto;
    newSocialEconomicGoal: CatalogDto;
    funding: FundingDto = new FundingDto();
    allFundingType: string[] = getAllFundingType();
    fundingToString: Function;

    _project: ProjectDto;

    codes: any = [];
    customer: any;

    disableTypeOfWorkButton: boolean = false;
    disableResultSpecificButton: boolean = false;
    disableExpectedResultButton: boolean = false;
    showTechnologyType: boolean = false;
    isAnotherTechnologyType: boolean = false;

    expectedResultList: any[] = [];
    outputTypeOfWorkList: any[] = typeOfWorkList;
    resultSpecificList: any[] = resultSpecificList;
    // commerceList: CatalogDto[] = [];
    choiceOfResultCharacterAppliedList: any[] = choiceOfResultCharacterApplied;
    technologyTypeList: any[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'другое'];

    commercializationMethods: CatalogDto[] = [];
    selectedCommercializationMethod: CatalogDto;

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
        this._dataService.getExpectedResult().subscribe((res => {
            this.expectedResultList = res;
        }))
        this._dataService.getCommercializationMethods().subscribe((res => {
            this.commercializationMethods = res;
        }))
    }

    @Input() set project(project: ProjectDto) {
        if (!project) project = new ProjectDto();
        if (!project.period) project.period = new PeriodDto();
        this._project = project;
        this.directions = this.dispDir();
    }

    private dispDir() {
        let directionsToDisplay: DirectionDto[] = [];
        let projectDirections = this._project.directions;
        for (let i = 0; i < projectDirections.length; i++) {
            let proDir = projectDirections[i] as DirectionDto;
            proDir.subDirectionDtos = [];
            directionsToDisplay.push(proDir);
        }
        if (this._project.subDirections === null){
            return directionsToDisplay;
        } else {
            let projectSubDirections = this._project.subDirections;
            for (let i = 0; i < projectSubDirections.length; i++) {
                let proSubDir = projectSubDirections[i];
                for (let j = 0; j < directionsToDisplay.length; j++) {
                    let dirToDis = directionsToDisplay[j];
                    let proDirId = proSubDir.direction.id;
                    let dirToDisId = dirToDis.id;
                    if(proDirId == dirToDisId){
                        dirToDis.subDirectionDtos.push(proSubDir);
                    }
                }
            }
        }
        return directionsToDisplay;
    }

    getProjectCodes() {
        this._dataService.getCatalog(Catalog.PROJECT_CODE).subscribe(res => this.codes = res)
    }

    selectCode(code) {
        this._project.code = code;
        if (
            this._project.code.code == '8.5' ||
            this._project.code.code == '8.7' ||
            this._project.code.code == '8.8ВПБИФ' ||
            this._project.code.code == '8.8ИПБИФ' ||
            this._project.code.code == '8.9' ||
            this._project.code.code == '8.12ИП' ||
            this._project.code.code == '8.13'
        ) {
            this.disableExpectedResultButton = true;
            this.selectExpectedResult( this.expectedResultList.find(result => result.expectedResultType === 'другое'));
        } else {
            let expRes: ExpectedResultDto;
            this.disableExpectedResultButton = false;
            this.selectExpectedResult(expRes);
        }
    }

  onSave() {
    this._project.directions = this.directions;
    this._project.subDirections = [];
    for (let i = 0; i < this.directions.length; i++) {
      for (let j = 0; j < this.directions[i].subDirectionDtos.length; j++) {
        this._project.subDirections.push(this.directions[i].subDirectionDtos[j]);
      }
    }
    this.validate();
    if (!this.canAddSocialEconomicGoals()) {
      this._project.socialEconomicGoals = [];
    }
    this.validateExpectedResultBlock();
    this.save.emit(this._project);
  }

    validateExpectedResultBlock() {
        if (!this._project.code.code.startsWith('8.10') && !this._project.code.code.startsWith('8.16')) {
            if (this._project.expectedResult) {
                if (this._project.expectedResult.expectedResultType === 'другое' && isEmptyOrNull(this._project.otherExpectedResult)) {
                    throw 'Вид ожидаемого результата экспертизы не может быть пустым.';
                }
                if (isEmptyOrNull(this._project.expectedResultDescription)) {
                    throw 'Описание ожидаемого результата экспертизы не может быть пустым.';
                }
                if (this._project.expectedResultDescription.length < 30){
                    throw "В пункте 'Описание ожидаемого результата экспертизы.' комментарий должен быть не менее 30 символов.";
                }
                if (this._project.expectedResultDescription.length > 500){
                    throw "В пункте 'Описание ожидаемого результата экспертизы.' комментарий должен быть не более 500 символов.";
                }
                if (isEmptyOrNull(this._project.workType)) {
                    throw 'Пожалуйста, выберите вид работ/Способ реализации объекта экспертизы.';
                }
                if (this._project.workType === 'другое' && isEmptyOrNull(this._project.otherWorkType)) {
                    throw 'Вид работ/Способ реализации объекта экспертизы не может быть пустым.';
                }
                if (isEmptyOrNull(this._project.selectedResultSpecific)) {
                    throw 'Пожалуйста, выберите характер результата.';
                }
                if (this._project.selectedResultSpecific === ResultSpecificEnum.APPLIED) {
                    if (isEmptyOrNull(this._project.resultCommercialization)) {
                        throw 'Пожалуйста, выберите результат подлежит коммерциализации или нет.';
                    } else {
                        if (this._project.resultCommercialization === 'Подлежит') {
                            if (isEmptyOrNull(this._project.commercializationDescription)) {
                                throw 'Описание объекта коммерциализации не может быть пустым.';
                            }
                            if (this._project.commercializationDescription.length < 30){
                                throw "В пункте 'Описание объекта коммерциализации.' комментарий должен быть не менее 30 символов.";
                            }
                            if (this._project.commercializationDescription.length > 256){
                                throw "В пункте 'Описание объекта коммерциализации.' комментарий должен быть не более 256 символов.";
                            }
                            if (this._project.commercializationMethods.length === 0) {
                                throw 'Пожалуйста, выберите способ коммерциализации.';
                            }
                        }
                        if (this._project.resultCommercialization === 'Не подлежит') {
                            if (isEmptyOrNull(this._project.implementationResult)) {
                                throw 'Пожалуйста, выберите характер результата - прикладной.';
                            }
                            if (isEmptyOrNull(this._project.implementationDescription)) {
                                throw 'Описание объекта внедрения не может быть пустым.';
                            }
                            if (this._project.implementationDescription.length < 30){
                                throw "В пункте 'Описание объекта внедрения.' комментарий должен быть не менее 30 символов.";
                            }
                            if (this._project.implementationDescription.length > 256){
                                throw "В пункте 'Описание объекта внедрения.' комментарий должен быть не более 256 символов.";
                            }
                            if (isEmptyOrNull(this._project.implementationSpecifying)) {
                                throw 'Указание способа внедрения не может быть пустым.';
                            }
                        }
                    }
                }
                if (this.showTechnologyType) {
                    if (isEmptyOrNull(this._project.technologicalOrder)) {
                        throw 'Пожалуйста, выберите технологический уклад.';
                    }
                    if (this.isAnotherTechnologyType && isEmptyOrNull(this._project.otherTechnologicalOrder)) {
                        throw 'Технологический уклад не может быть пустым.';
                    }
                }
            } else throw 'Пожалуйста, выберите вид ожидаемого результата экспертизы.';
        }
    }

    validate() {
        if (isEmptyOrNull(this._project.title)) {
            throw 'Наименование объекта экспертизы не может быть пустым.';
        }
        if (!this._project.code) {
            throw 'Пожалуйста, выберите код объекта экспертизы.';
        }

        if (this._project.code.expertReviewType == 'EXPERT_REVIEW_8_1_2_15_2025') {
            if (isEmptyOrNull(this._project.program)) {
                throw 'Наименование программы (подпрограммы) не может быть пустым.';
            }
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

    // addSocialEconomicGoal() {
    //     if (this.newSocialEconomicGoal) {
    //         this._project.socialEconomicGoals.push(this.newSocialEconomicGoal);
    //         this.newSocialEconomicGoal = null;
    //     }
    // }

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
            throw 'Пожалуйста, укажите сумму финансирования объекта экспертизы';
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
        return this.newDirection.subDirectionDtos;
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

  deleteDirection(dir: DirectionDto, i: number) {
      dir.subDirectionDtos = [];
      this.directions.splice(i, 1);
  }

    clearAppliedFields() {
        this._project.otherExpectedResult = undefined;
        this._project.otherWorkType = undefined;
        this.showTechnologyType = false;
        this._project.technologicalOrder = undefined;

        this.clearCommerceFields()
    }

    clearCommerceFields() {
        this._project.resultCommercialization = undefined;

        this._project.commercializationMethods = [];
        this._project.commercializationDescription = undefined;

        this._project.implementationResult = undefined;
        this._project.implementationDescription = undefined;
        this._project.implementationSpecifying = '';

        this._project.technologicalOrder = undefined;
        this._project.otherTechnologicalOrder = undefined;
    }

    clearFunctionalFields() {
        this._project.otherExpectedResult = undefined;
        this._project.otherWorkType = undefined;
        this.showTechnologyType = false;
        this._project.technologicalOrder = undefined;
    }

    selectExpectedResult(result) {
        this._project.expectedResult = result;
        this._project.workType = '';
        this.resultSpecificList = resultSpecificList;

        if (this._project.expectedResult) {
            if (this._project.expectedResult.workTypeDtos.length === 1) {
                this.disableTypeOfWorkButton = true;
                this._project.workType = this._project.expectedResult.workTypeDtos[0].description;
            } else {
                this.disableTypeOfWorkButton = false;
                this._project.workType = '';
            }
            this.outputTypeOfWorkList = this._project.expectedResult.workTypeDtos
        } else {
            this.outputTypeOfWorkList = typeOfWorkList;
        }

        if (this._project.expectedResult && this._project.expectedResult.resultCharacter === ResultSpecificEnum.APPLIED) {
            this.clearFunctionalFields();
            this.resultSpecificList = [ResultSpecificEnum.APPLIED];
            this._project.selectedResultSpecific = ResultSpecificEnum.APPLIED;
            this.disableResultSpecificButton = true;
        } else if (this._project.expectedResult && this._project.expectedResult.resultCharacter === ResultSpecificEnum.FUNDAMENTAL) {
            this.clearAppliedFields();
            this.resultSpecificList = [ResultSpecificEnum.FUNDAMENTAL];
            this._project.selectedResultSpecific = ResultSpecificEnum.FUNDAMENTAL;
            this.disableResultSpecificButton = true;
        } else {
            this.disableResultSpecificButton = false;
            this._project.selectedResultSpecific = '';
        }
    }

    selectTypeOfWork(typeOfWork) {
        this._project.workType = typeOfWork;

        if (typeOfWork !== TypeOfWorkEnum.OTHER) {
            this._project.otherWorkType = '';
        }
        if (this._project.expectedResult && this._project.expectedResult.expectedResultType === 'другое') {
            this.disableResultSpecificButton = false;
            if (typeOfWork === TypeOfWorkEnum.INVESTMENT_PROJECT ||
                typeOfWork === TypeOfWorkEnum.INNOVATIVE_PROJECT ||
                typeOfWork === TypeOfWorkEnum.VENTURE_PROJECT ||
                typeOfWork === TypeOfWorkEnum.WORK_ON_ORGANIZATION ||
                typeOfWork === TypeOfWorkEnum.DOCUMENTS_SET ||
                typeOfWork === TypeOfWorkEnum.INCLUDE_PROPOSAL) {
                this.showTechnologyType = true;
                this.selectResultSpecific(ResultSpecificEnum.MISSING)
                this.disableResultSpecificButton = true;
            } else {
                this.showTechnologyType = false;
                this.selectResultSpecific('');
            }
        }
    }

    selectResultSpecific(resultSpecific) {
        this._project.selectedResultSpecific = resultSpecific;
        if (this._project.selectedResultSpecific !== ResultSpecificEnum.APPLIED) {
            this.clearCommerceFields();
        }
    }

    isCommerce(flag: boolean) {
        this.showTechnologyType = true;
        if (flag) {
            this._project.resultCommercialization = 'Подлежит';
            this._project.implementationResult = '';
            this._project.implementationDescription = '';
            this._project.implementationSpecifying = '';
        } else {
            this._project.resultCommercialization = 'Не подлежит'
            this._project.commercializationMethods = [];
            this._project.commercializationDescription = '';
        }
    }

    selectCommerceResult() {
        if (!this.selectedCommercializationMethod ) {
            throw 'Пожалуйста, выберите способ коммерциализации.';
        }
        this._project.commercializationMethods.push(this.selectedCommercializationMethod);
        this.selectedCommercializationMethod = null;
    }

    selectChoiceOfResultCharacterAppliedResult(selectedElement) {
        this._project.implementationResult = selectedElement;
    }

    selectTechnologyType(technologyType) {
        this._project.technologicalOrder = technologyType;
        this.isAnotherTechnologyType = this._project.technologicalOrder === 'другое';
    }
}

export const choiceOfResultCharacterApplied: string[] = [
    'имеет промежуточный характер',
    'имеет побочный характер',
    'является объектом авторского права',
    'достижение только социального эффекта',
    'будет использован для собственных нужд',
    'обеспечение технологического суверенитета',
    'обеспечение национальной безопасности'
];

export enum TypeOfWorkEnum {
    NIR = 'НИР',
    OKR = 'ОКР',
    OTR = 'ОТР',
    INVESTMENT_PROJECT = 'Инвестиционный проект',
    INNOVATIVE_PROJECT = 'Инновационный проект',
    VENTURE_PROJECT = 'Венчурный проект',
    WORK_ON_ORGANIZATION = 'Работы по организации и освоению в производстве',
    DOCUMENTS_SET = 'Комплект заявочных документов',
    INCLUDE_PROPOSAL = 'Предложение о включении товаров в перечень высокотехнологичных',
    SPECIFICATION = 'Техническое задание',
    OTHER = 'другое'
}

export enum ResultSpecificEnum {
    FUNDAMENTAL = 'фундаментальный',
    APPLIED = 'прикладной',
    MISSING = 'не предусмотрен'
}

export const typeOfWorkList: any = [
    {name: 'NIR', description: TypeOfWorkEnum.NIR},
    {name: 'OKR', description: TypeOfWorkEnum.OKR},
    {name: 'OTR', description: TypeOfWorkEnum.OTR},
    {name: 'INNOVATIVE_PROJECT', description: TypeOfWorkEnum.INNOVATIVE_PROJECT},
    {name: 'INVESTMENT_PROJECT', description: TypeOfWorkEnum.INVESTMENT_PROJECT},
    {name: 'VENTURE_PROJECT', description: TypeOfWorkEnum.VENTURE_PROJECT},
    {name: 'WORK_ON_ORGANIZATION', description: TypeOfWorkEnum.WORK_ON_ORGANIZATION},
    {name: 'DOCUMENTS_SET', description: TypeOfWorkEnum.DOCUMENTS_SET},
    {name: 'INCLUDE_PROPOSAL', description: TypeOfWorkEnum.INCLUDE_PROPOSAL},
    {name: 'SPECIFICATION', description: TypeOfWorkEnum.SPECIFICATION},
    {name: 'OTHER', description: TypeOfWorkEnum.OTHER},

];

export const resultSpecificList: any = [ResultSpecificEnum.FUNDAMENTAL, ResultSpecificEnum.APPLIED, ResultSpecificEnum.MISSING];
