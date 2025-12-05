import {Component, ViewChild} from '@angular/core';
import {GlobalToastyService} from "app/services/global-toasty.service";
import {compareByField, sortPersonsByName} from "app/support/utils";
import {Catalog, DataService} from "@app/services/data.service";
import {BureauDto} from "@app/dto/BureauDto";
import {CouncilDto} from "@app/dto/CouncilDto";
import {PersonDto} from "@app/dto/PersonDto";
import {SectionDto} from "@app/dto/SectionDto";
import {getAllSectionTypes, SectionTypePipe} from "@app/pipes/section-type.pipe";
import {CouncilPipe} from "@app/pipes/council.pipe";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {CatalogDto} from "@app/dto/CatalogDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {Filter} from "@app/components/common-components/page-and-filter/model/Filter";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {SearchPersonComponent} from "@app/components/search/search-person/search-person.component";

@Component({
  selector: 'app-councils',
  templateUrl: './councils.component.html'
})
export class CouncilsComponent extends FilterAndPages<CouncilDto> {
  Catalog = Catalog;

  allSectionTypes: string[] = getAllSectionTypes();

  councils: CouncilDto[];
  selectedCouncil: CouncilDto;
  editedCouncil: CouncilDto;
  selectedBureau: BureauDto;
  editedBureau: BureauDto;
  selectedSection: SectionDto;
  editedSection: SectionDto;
  onPersonSelected: Function;
  searchPersonFilter: Filter<PersonPlainDto>;
  sectionTypeToString = value => this._sectionTypePipe.transform(value);
  newDirection: CatalogDto;
  belisa: IdNameDto;

  @ViewChild(SearchPersonComponent, { static: false }) public searchPersonModal: SearchPersonComponent;

  constructor(private _toasty: GlobalToastyService,
              private _dataService: DataService,
              private _sectionTypePipe: SectionTypePipe,
              private _councilPipe: CouncilPipe) {
    super();
  }

  ngOnInit() {
    this._dataService.getBelisa().subscribe(res => this.belisa = res);
    this._searchFields = [
      SearchField.contains('name').setPlaceholder('Поиск по наименованию...').setSortable(true),
      SearchField.equals('code').setPlaceholder('Поиск по коду...')
        .setSortDirection(Direction.ASC).setSortable(true),
      SearchField.multiSelect("directions", Catalog.DIRECTION)
        .setSelectText("Приоритетные направления")
        .setSearchFilterEnabled(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
    this.enableFilterCache("councils");
  }

  loadPage() {
    this._dataService.getCouncilsAdminPage(this._searchRequest).subscribe(res => {
      this.setLoading(false);
      this._page = res;
      this.councils = this._page.content;
      this.councils.forEach(council => CouncilsComponent.sortCouncilData(council));
      this.selectCouncil(this.councils[0])
    }, () => this.setLoading(false));
  }

  councilToString(council: CouncilDto) {
    // we perform transforming here
    // because the ui dot not update a view
    // when we use the pipe in the template
    return this._councilPipe.transform(council);
  }

  selectCouncil(council: CouncilDto) {
    if (this.selectedCouncil) {
      this.selectedCouncil.isEdit = false;
    }
    if (this.selectedBureau) {
      this.selectedBureau.isEdit = false;
    }
    this.selectedCouncil = council;
    if (council) {
      CouncilsComponent.sortSections(this.selectedCouncil);
      this.selectedBureau = council.bureau;
    } else {
      this.selectedBureau = null;
    }
  }

  editCouncil() {
    this.selectedCouncil.isEdit = this.selectedCouncil.isExpanded = true;
    this.editedCouncil = (this.selectedCouncil.id == 0 ?
      this.selectedCouncil : CouncilsComponent.copyCouncil(this.selectedCouncil));
  }

  showSearchBelisaWorkerModal() {
    this.onPersonSelected = person => {
      if (!this.editedCouncil.belisaWorkers.find(existingPerson => existingPerson.id == person.id)) {
        this.editedCouncil.belisaWorkers.push(person);
      }
    };
    this.searchPersonFilter = FilterBuilder.equals('org', this.belisa);
    this.showPersonModal();
  }

  cancelEditCouncil() {
    this.selectedCouncil.isEdit = false;
  }

  getSelectedCouncilInd() {
    return this.councils.findIndex(council => council == this.selectedCouncil);
  }

  saveEditedCouncil() {
    this._dataService.saveCouncil(this.editedCouncil).subscribe(res => {
      this._toasty.success("Сохранено.");
      this.councils[this.getSelectedCouncilInd()] = res;
      this.selectCouncil(res);
      this.selectedCouncil.isExpanded = true;
      CouncilsComponent.sortCouncils(this.councils);
      CouncilsComponent.sortCouncilData(this.selectedCouncil);
    });
  }

  addCouncil() {
    let newCouncil = new CouncilDto();
    this.councils.push(newCouncil);
    this.selectCouncil(newCouncil);
    this.editCouncil();
  }

  deleteCouncil() {
    this.councils.splice(this.getSelectedCouncilInd(), 1);
    this.selectCouncil(this.councils[0]);
  }

  editBureau() {
    this.selectedBureau.isEdit = this.selectedBureau.isExpanded = true;
    this.editedBureau = CouncilsComponent.copyBureau(this.selectedBureau);
  }

  showSearchBureauChairmanModal() {
    this.onPersonSelected = (person) => {
      this.editedBureau.chairman = person;
    };
    this.searchPersonFilter = null;
    this.showPersonModal();
  }

  showSearchBureauDeputyChairmanModal() {
    this.onPersonSelected = (person) => {
      this.editedBureau.deputyChairman = person;
    };
    this.searchPersonFilter = null;
    this.showPersonModal();
  }

  showSearchBureauSecretaryModal() {
    this.onPersonSelected = (person) => {
      this.editedBureau.secretary = person;
    };
    this.searchPersonFilter = null;
    this.showPersonModal();
  }

  showSearchBureauAssessorModal() {
    this.onPersonSelected = (person) => {
      if (!this.editedBureau.assessors.find(existingPerson => existingPerson.id == person.id)) {
        this.editedBureau.assessors.push(person);
      }
    };
    this.searchPersonFilter = null;
    this.showPersonModal();
  }

  cancelEditBureau() {
    this.selectedBureau.isEdit = false;
  }

  saveEditedBureau() {
    this._dataService.saveBureau(this.editedBureau).subscribe(res => {
      this._toasty.success("Сохранено.");
      this.selectedCouncil.bureau = this.selectedBureau = res;
      this.selectedBureau.isExpanded = true;
      sortPersonsByName(this.selectedBureau.assessors);
    });
  }

  editSection(section: SectionDto) {
    if (this.selectedSection) {
      this.selectedSection.isEdit = false;
    }
    this.selectedSection = section;
    this.editedSection = (section.id == 0 ?
      this.selectedSection : CouncilsComponent.copySection(this.selectedSection));
    this.selectedSection.isEdit = this.selectedSection.isExpanded = true;
  }

  showSearchSectionHeadModal() {
    this.onPersonSelected = (person) => {
      this.editedSection.head = person;
    };
    this.searchPersonFilter = null;
    this.showPersonModal();
  }

  showSearchSectionDeputyHeadModal() {
    this.onPersonSelected = (person) => {
      this.editedSection.deputyHead = person;
    };
    this.searchPersonFilter = null;
    this.showPersonModal();
  }

  showSearchSectionSecretaryModal() {
    this.onPersonSelected = (person) => {
      this.editedSection.secretary = person;
    };
    this.searchPersonFilter = null;
    this.showPersonModal();
  }

  showSearchSectionAssessorModal() {
    this.onPersonSelected = (person) => {
      if (!this.editedSection.assessors.find(existingPerson => existingPerson.id == person.id)) {
        this.editedSection.assessors.push(person);
      }
    };
    this.searchPersonFilter = null;
    this.showPersonModal();
  }

  cancelEditSection() {
    this.selectedSection.isEdit = false;
  }

  saveEditedSection(sectionInd) {
    this._dataService.saveSection(this.editedSection).subscribe(section => {
      this._toasty.success("Сохранено.");
      this.selectedCouncil.sections[sectionInd] = section;
      section.isExpanded = true;
      sortPersonsByName(section.assessors);
    });
  }

  deleteSection(sectionInd) {
    this.selectedCouncil.sections.splice(sectionInd, 1);
    // if (this.editedSection.id != 0) {
    //   this._dataService.deleteSection(this.editedSection.id).subscribe();
    // }
  }

  canAddSection() {
    return this.selectedCouncil && this.selectedCouncil.id != 0;
  }

  addSection() {
    let newSection = new SectionDto(this.selectedCouncil.id);
    this.selectedCouncil.sections.push(newSection);
    this.editSection(newSection);
  }

  showPersonModal() {
    this.searchPersonModal.show();
  }

  selectPerson(person: PersonDto) {
    this.onPersonSelected(person);
    this.searchPersonModal.hide();
  }

  addDirection() {
    if (this.newDirection) {
      this.editedCouncil.directions.push(this.newDirection);
      this.newDirection = null;
    }
  }

  static sortCouncils(councils: CouncilDto[]) {
    councils.sort(compareByField('code'));
  }

  static sortSections(council: CouncilDto) {
    council.sections.sort(compareByField('name'));
  }

  static sortCouncilData(council: CouncilDto) {
    sortPersonsByName(council.belisaWorkers);
    sortPersonsByName(council.bureau.assessors);
    council.sections.forEach(section => sortPersonsByName(section.assessors));
  }

  static copyCouncil(council: CouncilDto) {
    let newCouncil = Object.assign({}, council);
    newCouncil.belisaWorkers = [].concat(council.belisaWorkers);
    return newCouncil;
  }

  static copyBureau(bureau: BureauDto): BureauDto {
    let newBureau = Object.assign({}, bureau);
    newBureau.assessors = [].concat(bureau.assessors);
    return newBureau;
  }

  static copySection(section: SectionDto): SectionDto {
    let newSection = Object.assign({}, section);
    newSection.assessors = [].concat(section.assessors);
    return newSection;
  }
}
