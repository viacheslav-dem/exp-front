import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, output, viewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import {DataService} from "app/services/data.service";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-search-council',
    templateUrl: './search-council.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.search) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class SearchCouncilComponent implements OnInit {

  public data: any[];
  readonly selected = output<any>();
  public readonly searchModal = viewChild<ModalDirective>('searchModal');

  constructor(private _dataService: DataService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  onSelected(item) {
    this.selected.emit(item);
  }

  loadData() {
    this._dataService.getCouncils().subscribe(res => {
      this.data = res;
      this.cdr?.markForCheck?.();
    });
  }

  show() {
    this.loadData();
    this.searchModal()?.show();
    this.cdr?.markForCheck?.();
  }

  hide() {
    this.searchModal()?.hide();
    this.cdr?.markForCheck?.();
  }

}
