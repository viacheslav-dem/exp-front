import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'app-comment-list',
    templateUrl: './comment-list.component.html',
    standalone: false
})
export class CommentListComponent implements OnInit {

  @Input() comments: any[];

  constructor() { }

  ngOnInit() {
  }

}
