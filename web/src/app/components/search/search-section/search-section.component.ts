import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, output, viewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import {DataService} from "app/services/data.service";
import {SectionPlainDto} from "@app/dto/SectionPlainDto";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-search-section',
    templateUrl: './search-section.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.search) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})
export class SearchSectionComponent implements OnInit {

  public data: SectionPlainDto[];
  readonly selected = output<SectionPlainDto>();
  public readonly searchModal = viewChild<ModalDirective>('searchModal');

  constructor(private _dataService: DataService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  onSelected(item) {
    this.selected.emit(item);
  }

  loadData(councilId) {
    this._dataService.getSections(councilId).subscribe(res => {
      this.data = res;
      this.cdr?.markForCheck?.();
    });
  }

  show(councilId) {
    this.data = [];
    this.loadData(councilId);
    this.searchModal()?.show();
    this.cdr?.markForCheck?.();
  }

  hide() {
    this.searchModal()?.hide();
    this.cdr?.markForCheck?.();
  }
}
