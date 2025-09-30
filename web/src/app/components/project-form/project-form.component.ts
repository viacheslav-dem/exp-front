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
    isCommerceSubject: boolean;
    isAnotherTechnologyType: boolean = false;

    expectedResultList: any[] = [];
    outputTypeOfWorkList: any[] = typeOfWorkList;
    resultSpecificList: any[] = resultSpecificList;
    commerceList: any[] = commerceList;
    choiceOfResultCharacterAppliedList: any[] = choiceOfResultCharacterApplied;
    technologyTypeList: any[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'другое'];

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
        if (
            this._project.code.code == '8.5' ||
            this._project.code.code == '8.7' ||
            this._project.code.code == '8.8ВПБИФ' ||
            this._project.code.code == '8.8ИПБИФ' ||
            this._project.code.code == '8.9' ||
            this._project.code.code == '8.10' ||
            this._project.code.code == '8.12ИП' ||
            this._project.code.code == '8.13' ||
            this._project.code.code == '8.16'
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
        this.validate();
        if (!this.canAddSocialEconomicGoals()) {
            this._project.socialEconomicGoals = [];
        }
        this.save.emit(this._project);
    }

    validate() {
        if (this._project.code.expertReviewType == 'EXPERT_REVIEW_8_1_2_15_2025') {
            if (isEmptyOrNull(this._project.program)) {
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
        console.log(this.subDirection.id);
        if (this.newDirection) {
            this._project.directions.push(this.newDirection);
            this._project.subDirections.push(this.subDirection);
            this.newDirection = null;
            this.subDirection = null
        }
        console.log(this._project);
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

    displayDirection(directions: CatalogDto[]) {
        return directions as DirectionDto[];
    }

    clearAppliedFields() {
        this._project.otherExpectedResult = '';
        this._project.otherWorkType = '';
        this.showTechnologyType = false;
        this._project.technologicalOrder = ''
    }

    clearFunctionalFields() {
        this._project.otherExpectedResult = '';
        this._project.otherWorkType = '';
        this.showTechnologyType = false;
        this._project.technologicalOrder = ''
    }

    selectExpectedResult(result) {
        this._project.expectedResult = result;
        this._project.workType = '';
        this.resultSpecificList = resultSpecificList;
            if (this._project.expectedResult && this._project.expectedResult.resultCharacter === ResultSpecificEnum.APPLIED) {
                this.clearFunctionalFields();
                this.resultSpecificList = [ResultSpecificEnum.APPLIED];
                this.outputTypeOfWorkList = [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR]
                this.disableTypeOfWorkButton = false;
                this._project.selectedResultSpecific = ResultSpecificEnum.APPLIED;
                this._project.workType = '';
                this.disableResultSpecificButton = true;
            } else if (this._project.expectedResult &&  this._project.expectedResult.resultCharacter === ResultSpecificEnum.FUNDAMENTAL) {
                this.clearAppliedFields();
                this.resultSpecificList = [ResultSpecificEnum.FUNDAMENTAL];
                this.disableTypeOfWorkButton = true;
                this._project.selectedResultSpecific = ResultSpecificEnum.FUNDAMENTAL;
                this.disableResultSpecificButton = true;
                this._project.workType = TypeOfWorkEnum.NIR;
            } else {
                this.disableTypeOfWorkButton = false;
                this.disableResultSpecificButton = false;
                this.outputTypeOfWorkList = typeOfWorkList;
                this._project.workType = '';
                this._project.selectedResultSpecific = '';
            }
    }

    selectTypeOfWork(typeOfWork) {
        this._project.workType = typeOfWork;

        if (typeOfWork !== TypeOfWorkEnum.OTHER) {
            this._project.otherWorkType = '';
        }

        if (this._project.expectedResult.expectedResultType === 'другое') {
            this.disableResultSpecificButton = false;
            if (typeOfWork === TypeOfWorkEnum.BUSINESS_PLAN ||
                typeOfWork === TypeOfWorkEnum.INNOVATIVE_PROJECT ||
                typeOfWork === TypeOfWorkEnum.DOCUMENTS_SET ||
                typeOfWork === TypeOfWorkEnum.INCLUDE_PROPOSAL ||
                typeOfWork === TypeOfWorkEnum.OTHER) {
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
    }


    isCommerce(flag: boolean) {
        this.isCommerceSubject = flag;
        this.showTechnologyType = true;
        if (this.isCommerceSubject) {
            this._project.resultCommercialization = 'Подлежит';
            this._project.implementationResult = '';
            this._project.implementationDescription = '';
            this._project.implementationSpecifying = '';
        } else {
            this._project.resultCommercialization = 'Не подлежит'
            this._project.commercializationMethod = '';
            this._project.commercializationDescription = '';
        }
    }

    selectCommerceResult(commerce) {
        this._project.commercializationMethod = commerce;
    }

    selectChoiceOfResultCharacterAppliedResult(selectedElement) {
        this._project.implementationResult = selectedElement;
    }

    selectTechnologyType(technologyType) {
        this._project.technologicalOrder = technologyType;
        this.isAnotherTechnologyType = this._project.technologicalOrder === 'другое';
    }
}

export const commerceList: string[] = [
    'реализация товаров (работ, услуг), создаваемых (выполняемых, оказываемых) с применением результатов научно-технической деятельности ',

    'использование результатов научно-технической деятельности для собственных нужд',

    'предоставление на возмездной основе другим лицам права на использование результатов научно-технической деятельности',

    'полная передача на возмездной основе другим лицам имущественных прав на результаты научно-технической деятельности',

    'безвозмездная передача другим лицам имущественных прав на результаты научно-технической деятельности',

    'безвозмездное предоставление права на использование результатов научно-технической деятельности с условием последующей ' +
    'их коммерциализации приобретателем этих прав посредством реализации товаров (работ, услуг), создаваемых (выполняемых, оказываемых) ' +
    'с применением результатов научно-технической деятельности, или использования результатов научно-технической деятельности ' +
    'для собственных нужд, или предоставления на возмездной основе другим лицам права на использование результатов научно-технической деятельности',

    'возмездная передача сведений (части сведений), составляющих секреты производства (ноу-хау) ',

    'безвозмездная передача сведений (части сведений), составляющих секреты производства (ноу-хау), ' +
    'с условием последующей их коммерциализации приобретателем посредством реализации товаров (работ, услуг), ' +
    'создаваемых (выполняемых, оказываемых) с применением результатов научно-технической деятельности, ' +
    'или использования результатов научно-технической деятельности для собственных нужд, или возмездной передачи сведений (части сведений), ' +
    'составляющих секреты производства (ноу-хау)',

    'возмездная передача документированной научно-технической информации',

    'безвозмездная передача документированной научно-технической информации с условием последующей ее коммерциализации приобретателем посредством ' +
    'реализации товаров (работ, услуг), создаваемых (выполняемых, оказываемых) с применением результатов научно-технической деятельности, ' +
    'или использования результатов научно-технической деятельности для собственных нужд, или возмездной передачи документированной ' +

    'научно-технической информации',

    'не подлежит обязательной коммерциализации**.'
];

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
    BUSINESS_PLAN = 'Бизнес план',
    INNOVATIVE_PROJECT = 'Инновационный проект',
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
     TypeOfWorkEnum.NIR,
     TypeOfWorkEnum.OKR,
     TypeOfWorkEnum.OTR,
     TypeOfWorkEnum.BUSINESS_PLAN,
     TypeOfWorkEnum.INNOVATIVE_PROJECT,
     TypeOfWorkEnum.DOCUMENTS_SET,
     TypeOfWorkEnum.INCLUDE_PROPOSAL,
     TypeOfWorkEnum.SPECIFICATION,
     TypeOfWorkEnum.OTHER
];

export const resultSpecificList: any = [ResultSpecificEnum.FUNDAMENTAL, ResultSpecificEnum.APPLIED, ResultSpecificEnum.MISSING];
