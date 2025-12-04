import {Component, OnInit, input} from '@angular/core';

@Component({
    selector: 'app-comment-list',
    templateUrl: './comment-list.component.html',
    standalone: false
})
export class CommentListComponent implements OnInit {

  readonly comments = input<any[]>(undefined);

  constructor() { }

  ngOnInit() {
  }

}
