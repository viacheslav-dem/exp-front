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








    expectedResultList: any[] = expectedResultList;
    selectedResult: string;
    expectedResult: string;
    expectedResultDescription: string;
    expectedResultReferenceInformation: string = 'Cправочная информация';
    selectExpectedResult(result) {
        this.selectedResult = result.name;
        this.resultSpecificList = this.resultSpecificList.filter(item => item !== ResultSpecificEnum.MISSING)

        if (result.specific === ResultSpecificEnum.APPLIED){
            this.selectTypeOfWork('');
            this.disableTypeOfWorkButton = false;
            this.selectedResultSpecific = ResultSpecificEnum.APPLIED;
            this.disableResultSpecificButton = true;
        } else if (result.specific == ResultSpecificEnum.FUNDAMENTAL) {
            this.selectTypeOfWork(TypeOfWorkEnum.NIR);
            this.disableTypeOfWorkButton = true;
            this.selectedResultSpecific = ResultSpecificEnum.FUNDAMENTAL;
            this.disableResultSpecificButton = true;
        } else {
            this.selectTypeOfWork('');
            this.resultSpecificList.push(ResultSpecificEnum.MISSING);
            this.disableTypeOfWorkButton = false;
            this.disableResultSpecificButton = false;
            this.selectedResultSpecific = '';
        }



    }

    disableTypeOfWorkButton: boolean = false;
    disableResultSpecificButton: boolean = false;

    typeOfWorkList: any = [TypeOfWorkEnum.NIR ,TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR, TypeOfWorkEnum.OTHER];
    selectedTypeOfWork: string;
    typeOfWork: string;
    selectTypeOfWork(typeOfWork) {
        this.selectedTypeOfWork = typeOfWork;
    }


    resultSpecificList: any = [ResultSpecificEnum.FUNDAMENTAL, ResultSpecificEnum.APPLIED];
    selectedResultSpecific: string;
    selectResultSpecific(resultSpecific) {
        this.selectedResultSpecific = resultSpecific;
    }

    isCommerceSubject: boolean;

    commerceList: any[] = commerceList;
    commerce: string;
    commerceText: string;
    selectCommerceResult(commerce) {
        this.commerce = commerce;
    }

    choiceOfResultCharacterAppliedList: any[] = choiceOfResultCharacterApplied;
    choiceOfResultCharacterAppliedSelectedElement: string;
    implementationObjectDescription: string;
    implementationObjectWay: string;
    selectChoiceOfResultCharacterAppliedResult(selectedElement) {
        this. choiceOfResultCharacterAppliedSelectedElement = selectedElement;
    }

    technologyType: string;
    selectedTechnologyType: string;
    technologyTypeList: any[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'Другое'];
    isAnotherTechnologyType: boolean = false;
    selectTechnologyType(technologyType) {
        this.selectedTechnologyType = technologyType;
        if (this.selectedTechnologyType === 'Другое') {
            this.technologyType = '';
            this.isAnotherTechnologyType = true;
        } else {
            this.isAnotherTechnologyType = false;
            this.technologyType = technologyType;
        }
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
    'иные способы, предусмотренные актами законодательства',
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
    OTHER = 'Другое'
}

export enum ResultSpecificEnum {
    FUNDAMENTAL = 'Фундаментальный',
    APPLIED = 'Прикладной',
    MISSING = 'Отсутствует'
}

export const expectedResultList: any[] = [
    {name: 'сделано открытие (открыт закон, закономерность)', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name: 'разработана научная теория', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name: 'выдвинута и обоснована научная гипотеза', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name:  'сформирована новая область (направление) исследований', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name: 'обнаружено новое явление', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name: 'обнаружено новое свойство известного явления', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name:  'разработаны методы достижения научных решений, направленных на развитие фундаментальных исследований', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name:  'обобщены решения частных научных задач', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name: 'систематизированы ранее известные подходы к использованию теорий и открытий в практике', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name:  'разработана теория', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name:   'разработаны новые методы измерений', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name: 'выдвинута и обоснована гипотеза', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name:  'разработана концепция', specific: ResultSpecificEnum.FUNDAMENTAL},
    {name: 'разработан аналитический доклад с предложениями', specific: ResultSpecificEnum.FUNDAMENTAL},

    {name: 'разработан экспериментальный макет изделия', specific: ResultSpecificEnum.APPLIED},
    {name:  'разработан опытный образец изделия', specific: ResultSpecificEnum.APPLIED},
    {name:  'создан промышленный образец', specific: ResultSpecificEnum.APPLIED},
    {name:  'разработан экспериментальный образец технологии получения нового материала', specific: ResultSpecificEnum.APPLIED},
    {name: 'разработан опытный образец новой технологии получения материалов', specific: ResultSpecificEnum.APPLIED},
    {name: 'разработан проект технологического процесса', specific: ResultSpecificEnum.APPLIED},
    {name: 'разработан стандарт, технические условия', specific: ResultSpecificEnum.APPLIED},
    {name: 'разработана методика (измерения, контроля и т. д.)', specific: ResultSpecificEnum.APPLIED},
    {name: 'разработаны методические рекомендации (использования оборудования приборов и т. д.)', specific: ResultSpecificEnum.APPLIED},
    {name: 'разработан проект нормативного акта', specific: ResultSpecificEnum.APPLIED},
    {name: 'разработана программа, план, концепция', specific: ResultSpecificEnum.APPLIED},
    {name: 'разработаны методические рекомендации (документ, пособие, положение и т. д.)', specific: ResultSpecificEnum.APPLIED},
    {name: 'разработаны новые нормативы', specific: ResultSpecificEnum.APPLIED},
    {name: 'разработаны рекомендации', specific: ResultSpecificEnum.APPLIED},

    {name: 'Другое', specific: ''}
]