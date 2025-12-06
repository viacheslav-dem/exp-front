import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import {DataService} from "app/services/data.service";
import {SectionPlainDto} from "@app/dto/SectionPlainDto";

@Component({
  selector: 'app-search-section',
  templateUrl: './search-section.component.html'
})
export class SearchSectionComponent implements OnInit {

  public data: SectionPlainDto[];
  @Output() selected = new EventEmitter<SectionPlainDto>();
  @ViewChild('searchModal', { static: false }) public searchModal: ModalDirective;

  constructor(private _dataService: DataService) {
  }

  ngOnInit() {
  }

  onSelected(item) {
    this.selected.emit(item);
  }

  loadData(councilId) {
    this._dataService.getSections(councilId).subscribe(res => this.data = res)
  }

  show(councilId) {
    this.data = [];
    this.loadData(councilId);
    this.searchModal.show();
  }

  hide() {
    this.searchModal.hide();
  }
}
