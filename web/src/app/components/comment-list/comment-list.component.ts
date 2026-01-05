import {ChangeDetectionStrategy, Component, OnInit, input} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-comment-list',
    templateUrl: './comment-list.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.listsAndInfo) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class CommentListComponent implements OnInit {

  readonly comments = input<any[]>(undefined);

  constructor() { }

  ngOnInit() {
  }

}
