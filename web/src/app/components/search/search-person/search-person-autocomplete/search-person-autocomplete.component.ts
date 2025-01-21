import {map} from 'rxjs/operators';
import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {PersonService} from "app/services/person.service";
import {CompleterData, CompleterItem} from "ng2-completer";
import {AutoCompleteDataSource} from "app/components/search/search-person/search-person-autocomplete/AutoCompleteDataSource";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {sortByName} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {Pagination} from "@app/components/common-components/page-and-filter/model/Pagination";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";

@Component({
  selector: 'app-search-person-autocomplete',
  template: `
    <ng2-completer [minSearchLength]="2" [(ngModel)]="person" [datasource]="autoCompleteSource"
                   placeholder="Фамилия" [clearUnselected]="true"
                   (selected)="onPersonSelect($event)"
                   textSearching="Поиск..." textNoResults="Ничего не найдено"></ng2-completer>

  `
})
export class SearchPersonAutocompleteComponent implements OnInit {

  public person;
  autoCompleteSource: CompleterData;

  @Output() public selected = new EventEmitter();

  constructor(private _service: PersonService) {
    this.autoCompleteSource = new AutoCompleteDataSource((login: string) => {
        let filter = FilterBuilder.startsWith('personName.lastName', login);
        let pagination = new Pagination(30);
        let request = new SearchPageRequest(pagination, filter, sortByName('personName.'));
        return this._service.searchPersons(request).pipe(map((response) => {
          // console.log("response", response);
          let searchResults = response.content;
          let data: CompleterItem[] = [];
          searchResults.forEach(person => data.push({
              title: `${person.personName.lastName} ${person.personName.firstName} ${person.personName.middleName}`,
              originalObject: person
            })
          );
          return data;
        }));
      }
    );
  }

  ngOnInit() {
  }

  onPersonSelect(event) {
    if (event) {
      this.selected.emit(event.originalObject);
    }
  }
}
