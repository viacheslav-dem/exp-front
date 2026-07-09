import {Component, OnInit, input, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-checkbox-list',
    template: `
    <div>
      @for (opt of options(); track opt) {
        <div>
          <app-checkbox [(ngModel)]="opt.selected" (onChecked)="select(opt)"> {{opt.label}}</app-checkbox>
        </div>
      }
    </div>
    `,
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.commonControls)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class CheckBoxListComponent implements OnInit {
  
  constructor(private cdr: ChangeDetectorRef) {}


  readonly selected = input<any[]>(undefined);

  readonly options = input<ListItem[]>([]);

  ngOnInit(): void {
  }

  private getIndex(item: any): number {
    if (item.id) {
      for (let i = 0; i < this.selected().length; i++)
        if (item.id == this.selected()[i].id)
          return i;
      return -1;
    } else {
      return this.selected().indexOf(item);
    }
  }

  select(item: ListItem) {
    //Value updates after this method called
    if (item.selected) {
      if (this.getIndex(item.value) < 0) {
        this.selected().push(item.value);
      }
    } else {
      let index = this.getIndex(item.value);
      if (index >= 0) {
        this.selected().splice(index, 1);
      }
    }
    this.cdr?.markForCheck?.();
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
