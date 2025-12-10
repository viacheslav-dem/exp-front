import {Component, Input, OnInit} from "@angular/core";

@Component({
    selector: 'app-checkbox-list',
    template: `
    <div>
      @for (opt of options; track opt) {
        <div>
          <app-checkbox [(ngModel)]="opt.selected" (onChecked)="select(opt)"> {{opt.label}}</app-checkbox>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class CheckBoxListComponent implements OnInit {


  @Input()
  selected: any[];

  @Input()
  options: ListItem[] = [];

  ngOnInit(): void {
  }

  private getIndex(item: any): number {
    if (item.id) {
      for (let i = 0; i < this.selected.length; i++)
        if (item.id == this.selected[i].id)
          return i;
      return -1;
    } else {
      return this.selected.indexOf(item);
    }
  }

  select(item: ListItem) {
    //Value updates after this method called
    if (item.selected) {
      if (this.getIndex(item.value) < 0) {
        this.selected.push(item.value);
      }
    } else {
      let index = this.getIndex(item.value);
      if (index >= 0) {
        this.selected.splice(index, 1);
      }
    }
  }
}

export class ListItem {

  label: string;
  value: any;
  selected: boolean = false;

  constructor(label: string, value: any) {
    this.label = label;
    this.value = value;
  }
}
