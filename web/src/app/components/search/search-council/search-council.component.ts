import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
import {DataService} from "app/services/data.service";

@Component({
  selector: 'app-search-council',
  templateUrl: './search-council.component.html'
})
export class SearchCouncilComponent implements OnInit {

  public data: any[];
  @Output() selected = new EventEmitter();
  @ViewChild('searchModal', { static: false }) public searchModal: ModalDirective;

  constructor(private _dataService: DataService) {
  }

  ngOnInit() {
  }

  onSelected(item) {
    this.selected.emit(item);
  }

  loadData() {
    this._dataService.getCouncils().subscribe(res => this.data = res)
  }

  show() {
    this.loadData();
    this.searchModal.show();
  }

  hide() {
    this.searchModal.hide();
  }

}
