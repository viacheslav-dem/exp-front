import {map} from 'rxjs/operators';
import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {PersonService} from "app/services/person.service";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {sortByName} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {Pagination} from "@app/components/common-components/page-and-filter/model/Pagination";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {Subject, of} from "rxjs";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-search-person-autocomplete',
  template: `
    <ng-select
      [items]="items"
      bindLabel="title"
      [typeahead]="searchInput$"
      [(ngModel)]="person"
      placeholder="Фамилия"
      [clearable]="true"
      [searchable]="true"
      [loading]="loading"
      [typeToSearchText]="'Поиск...'"
      [notFoundText]="'Ничего не найдено'"
      (change)="onPersonSelect($event)">
    </ng-select>

  `
})
export class SearchPersonAutocompleteComponent implements OnInit {

  public person;
  items: any[] = [];
  loading: boolean = false;
  searchInput$ = new Subject<string>();

  @Output() public selected = new EventEmitter();

  constructor(private _service: PersonService) {
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((login: string) => {
          if (!login || login.length < 2) {
            return of([]);
          }
          this.loading = true;
          const filter = FilterBuilder.startsWith('personName.lastName', login);
          const pagination = new Pagination(30);
          const request = new SearchPageRequest(pagination, filter, sortByName('personName.'));
          return this._service.searchPersons(request).pipe(
            map((response) => {
              const searchResults = response.content;
              return searchResults.map(person => ({
                title: `${person.personName.lastName} ${person.personName.firstName} ${person.personName.middleName}`,
                originalObject: person
              }));
            })
          );
        })
      )
      .subscribe((items) => {
        this.items = items;
        this.loading = false;
      });
  }

  ngOnInit() {
  }

  onPersonSelect(event) {
    if (event) {
      this.selected.emit(event.originalObject);
    }
  }
}
