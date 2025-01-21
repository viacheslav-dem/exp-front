import {Component, Input, OnInit} from "@angular/core";
import {AgendaService} from "@app/services/agenda.service";
import {IdDto} from "@app/dto/IdDto";
import {CommentDto} from "@app/dto/CommentDto";

@Component({
  selector: 'app-agenda-chat',
  templateUrl: 'agenda-chat.component.html'
})
export class AgendaChatComponent implements OnInit {

  public _agenda: IdDto;
  public comments: any[];
  public text: string;

  constructor(private _agendaService: AgendaService) {
  }

  ngOnInit() {
  }

  @Input() set agenda(agenda: IdDto) {
    if (agenda) {
      this._agenda = agenda;
      this.loadComments();
    }
  }

  loadComments() {
    this._agendaService.getCommentsByAgenda(this._agenda)
      .subscribe(res => this.comments = res);
  }

  createComment() {
    this._agendaService.createComment(this._agenda, new CommentDto(this._agenda, this.text))
      .subscribe(() => this.loadComments());
  }
}
