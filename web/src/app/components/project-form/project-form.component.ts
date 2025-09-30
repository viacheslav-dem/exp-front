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
            this.selectExpectedResult({
                expectedResultType: 'другое',
                resultCharacter: '',
                workType: [
                    TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR,
                    TypeOfWorkEnum.BUSINESS_PLAN, TypeOfWorkEnum.INNOVATIVE_PROJECT,
                    TypeOfWorkEnum.DOCUMENTS_SET, TypeOfWorkEnum.INCLUDE_PROPOSAL,
                    TypeOfWorkEnum.SPECIFICATION, TypeOfWorkEnum.OTHER],
                description: 'Введите свой вид ожидаемого результата в дополнительном текстовом поле.'
            });
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

    }

    clearFunctionalFields() {

    }

    disableTypeOfWorkButton: boolean = false;
    disableResultSpecificButton: boolean = false;
    disableExpectedResultButton: boolean = false;






    expectedResultList: any[] = [];


    selectExpectedResult(result) {
        this._project.expectedResult = result;

        console.log('---------------')
        console.log(this._project)
        console.log('---------------')



        // if (this._project.expectedResult.resultCharacter !== ResultSpecificEnum.MISSING && !isEmptyOrNull(this._project.expectedResult.resultCharacter)){
        //     // Выбран ожидаемый результат с характером Прикладной или фундаментальный
        //
        //     this._project.expectedResult.resultCharacter
        //     console.log('11111111111111111111111111111')
        // } else {
        //     // Выбран пункт Другое
        //     console.log('22222222222222222222222222222')
        // }




        this.resultSpecificList = resultSpecificList;
            if (this._project.expectedResult && this._project.expectedResult.resultCharacter === ResultSpecificEnum.APPLIED) {
                this.selectedTypeOfWork = '';
                this.resultSpecificList = [ResultSpecificEnum.APPLIED];
                this.outputTypeOfWorkList = typeOfWorkList.filter(item => item.specific.includes(ResultSpecificEnum.APPLIED) && !item.specific.includes(ResultSpecificEnum.MISSING))
                this.outputTypeOfWorkList = this._project.expectedResult.workTypes
                this.disableTypeOfWorkButton = false;
                this.selectedResultSpecific = ResultSpecificEnum.APPLIED;
                this.disableResultSpecificButton = true;
            } else if (this._project.expectedResult &&  this._project.expectedResult.resultCharacter === ResultSpecificEnum.FUNDAMENTAL) {
                this.selectedTypeOfWork = TypeOfWorkEnum.NIR;
                this.resultSpecificList = [ResultSpecificEnum.FUNDAMENTAL];
                this.disableTypeOfWorkButton = true;
                this.selectedResultSpecific = ResultSpecificEnum.FUNDAMENTAL;
                this.disableResultSpecificButton = true;
            } else {
                this.disableTypeOfWorkButton = false;
                this.disableResultSpecificButton = false;
                this.outputTypeOfWorkList = typeOfWorkList;
                this.selectedTypeOfWork = '';
                this.selectedResultSpecific = '';
            }
    }



    outputTypeOfWorkList: any[] = typeOfWorkList;

    selectedTypeOfWork: string;
    typeOfWork: string;
    selectTypeOfWork(typeOfWork) {

        this._project.workType = typeOfWork.name;
        if (typeOfWork.name !== TypeOfWorkEnum.OTHER) {
            this._project.otherWorkType = '';
        }

        this.showTechnologyType = typeOfWork.name.includes( TypeOfWorkEnum.BUSINESS_PLAN ) ||
            typeOfWork.name.includes( TypeOfWorkEnum.INNOVATIVE_PROJECT ) ||
            typeOfWork.name.includes( TypeOfWorkEnum.DOCUMENTS_SET ) ||
            typeOfWork.name.includes( TypeOfWorkEnum.INCLUDE_PROPOSAL ) ||
            typeOfWork.name.includes( TypeOfWorkEnum.OTHER );


        if (this.showTechnologyType) {
            this.selectResultSpecific(ResultSpecificEnum.MISSING)
            this.disableResultSpecificButton = true;
        }
        else {
            this.selectResultSpecific('')
            this.disableResultSpecificButton = false;
        }


        console.log('------------------------------')
        console.log('this.showTechnologyType')
        console.log(this.showTechnologyType)
        console.log('------------------------------')
        console.log('------------------------------')
        console.log('this._project.expectedResult.resultCharacter')
        // console.log(this._project.expectedResult.resultCharacter)
        console.log('------------------------------')

        console.log('typeOfWork')
        console.log(typeOfWork)

        this.selectedTypeOfWork = typeOfWork.name;
        this.resultSpecificList = typeOfWork.specific;



         //
         //    ПЕРЕДЕЛАТЬ, ведь typeOfWork будет не в формате {name, specific}
         //

         if (this._project.expectedResult && !isEmptyOrNull(this._project.expectedResult.resultCharacter)) {
             this.selectedResultSpecific = this._project.expectedResult.resultCharacter;
             this.disableResultSpecificButton = true;
         } else {
             if (this.resultSpecificList.length === 1) {
                 this.disableResultSpecificButton = true;
                 this.selectedResultSpecific = this.resultSpecificList[0];
             }
             else {
                 this.disableResultSpecificButton = false;
                 this.selectedResultSpecific = '';
             }
         }



    }


    resultSpecificList: any[] = resultSpecificList;
    selectedResultSpecific: string;
    selectResultSpecific(resultSpecific) {
        this.selectedResultSpecific = resultSpecific;
        this._project.expectedResult.resultCharacter = resultSpecific;
    }

    isCommerceSubject: boolean;
    isCommerce(flag: boolean) {
        this.isCommerceSubject = flag;
        this.showTechnologyType = true;
        if (this.isCommerceSubject) {
            this._project.resultCommercialization = 'Подлежит'
        } else {
            this._project.resultCommercialization = 'Не подлежит'
        }
    }

    commerceList: any[] = commerceList;
    commerce: string;
    commerceText: string;
    selectCommerceResult(commerce) {
        this.commerce = commerce;
        this._project.commercializationMethod = commerce;
    }

    choiceOfResultCharacterAppliedList: any[] = choiceOfResultCharacterApplied;
    choiceOfResultCharacterAppliedSelectedElement: string;
    implementationObjectDescription: string;
    implementationObjectWay: string;
    selectChoiceOfResultCharacterAppliedResult(selectedElement) {
        this.choiceOfResultCharacterAppliedSelectedElement = selectedElement;
        this._project.implementationResult = selectedElement;
    }

    showTechnologyType: boolean = false;
    technologyType: string;
    selectedTechnologyType: string;
    technologyTypeList: any[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'Другое'];
    isAnotherTechnologyType: boolean = false;
    selectTechnologyType(technologyType) {
        this.selectedTechnologyType = technologyType;
        this._project.technologicalOrder = technologyType;
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
    OTHER = 'Другое'
}

export enum ResultSpecificEnum {
    FUNDAMENTAL = 'фундаментальный',
    APPLIED = 'прикладной',
    MISSING = 'не предусмотрен'
}

export const typeOfWorkList: any = [
    {name: TypeOfWorkEnum.NIR, specific: [ResultSpecificEnum.FUNDAMENTAL, ResultSpecificEnum.APPLIED]},
    {name: TypeOfWorkEnum.OKR, specific: [ResultSpecificEnum.APPLIED]},
    {name: TypeOfWorkEnum.OTR, specific: [ResultSpecificEnum.APPLIED]},
    {name: TypeOfWorkEnum.BUSINESS_PLAN, specific: [ResultSpecificEnum.MISSING]},
    {name: TypeOfWorkEnum.INNOVATIVE_PROJECT, specific: [ResultSpecificEnum.MISSING]},
    {name: TypeOfWorkEnum.DOCUMENTS_SET, specific: [ResultSpecificEnum.MISSING]},
    {name: TypeOfWorkEnum.INCLUDE_PROPOSAL, specific: [ResultSpecificEnum.MISSING]},
    {name: TypeOfWorkEnum.SPECIFICATION, specific: [ResultSpecificEnum.FUNDAMENTAL, ResultSpecificEnum.APPLIED, ResultSpecificEnum.MISSING]},
    {name: TypeOfWorkEnum.OTHER, specific: [ResultSpecificEnum.FUNDAMENTAL, ResultSpecificEnum.APPLIED, ResultSpecificEnum.MISSING]},
];

export const resultSpecificList: any = [ResultSpecificEnum.FUNDAMENTAL, ResultSpecificEnum.APPLIED, ResultSpecificEnum.MISSING];

export const expectedResultList: any[] = [
    {
        expectedResultType: 'сделано открытие (открыт закон, закономерность)',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработана научная теория',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'выдвинута и обоснована научная гипотеза',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'сформирована новая область (направление) исследований',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'обнаружено новое явление',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'обнаружено новое свойство известного явления',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработаны методы достижения научных решений, направленных на развитие фундаментальных исследований',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'обобщены решения частных научных задач',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },

    {
        expectedResultType: 'систематизированы ранее известные подходы к использованию теорий и открытий в практике',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработана теория',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработаны новые методы измерений',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'выдвинута и обоснована гипотеза',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработана концепция',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработан аналитический доклад с предложениями',
        resultCharacter: ResultSpecificEnum.FUNDAMENTAL,
        workType: [TypeOfWorkEnum.NIR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработан экспериментальный макет изделия',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },

    {
        expectedResultType: 'разработан опытный образец изделия',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'создан промышленный образец',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработан экспериментальный образец технологии получения нового материала',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработан опытный образец новой технологии получения материалов',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработан проект технологического процесса',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработан стандарт, технические условия',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработана методика (измерения, контроля и т. д.)',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработаны методические рекомендации (использования оборудования приборов и т. д.)',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработан проект нормативного акта',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработана программа, план, концепция',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработаны методические рекомендации (документ, пособие, положение и т. д.)',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработаны новые нормативы',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'разработаны рекомендации',
        resultCharacter: ResultSpecificEnum.APPLIED,
        workType: [TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR],
        description: 'Справочная информация'
    },
    {
        expectedResultType: 'другое',
        resultCharacter: '',
        workType: [
            TypeOfWorkEnum.NIR, TypeOfWorkEnum.OKR, TypeOfWorkEnum.OTR,
            TypeOfWorkEnum.BUSINESS_PLAN, TypeOfWorkEnum.INNOVATIVE_PROJECT,
            TypeOfWorkEnum.DOCUMENTS_SET, TypeOfWorkEnum.INCLUDE_PROPOSAL,
            TypeOfWorkEnum.SPECIFICATION, TypeOfWorkEnum.OTHER],
        description: 'Введите свой вид ожидаемого результата в дополнительном текстовом поле.'
    },
]