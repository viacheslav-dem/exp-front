import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [`
    .nav-link {
        white-space: nowrap;
        padding: 0.5rem;
    }
  `]
})
export class MenuComponent implements OnInit {

  @Input()
  menu: MenuItem[];

  constructor() {
  }

  ngOnInit() {
  }
}

export interface MenuItem {
  link: string;
  title: string;
  children: MenuItem[];
}
