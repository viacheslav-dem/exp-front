import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, effect, input} from "@angular/core";
import {AgendaService} from "@app/services/agenda.service";
import {IdDto} from "@app/dto/IdDto";
import {CommentDto} from "@app/dto/CommentDto";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-agenda-chat',
    templateUrl: 'agenda-chat.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.listsAndInfo) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})
export class AgendaChatComponent implements OnInit {

  public _agenda: IdDto;
  public comments: any[];
  public text: string;

  readonly agenda = input<IdDto | undefined>(undefined);
  private readonly _agendaEffect = effect(() => {
    const agenda = this.agenda();
    if (agenda) {
      this._agenda = agenda;
      this.loadComments();
    }
  });

  constructor(private _agendaService: AgendaService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  loadComments() {
    this._agendaService.getCommentsByAgenda(this._agenda)
      .subscribe(res => {
        this.comments = res;
        this.cdr?.markForCheck?.();
      });
  }

  createComment() {
    if (!this.text || !this.text.trim()) {
      return;
    }
    this._agendaService.createComment(this._agenda, new CommentDto(this._agenda, this.text))
      .subscribe(() => {
        this.text = '';
        this.loadComments();
        this.cdr?.markForCheck?.();
      });
  }
}
