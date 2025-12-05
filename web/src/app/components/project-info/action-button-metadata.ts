export class ActionButtonMetadata {
  title: string;
  styleClass: string = 'btn btn-sm';
  onclick: any;

  constructor(title: string, onclick: any, style: string) {
    this.title = title;
    this.onclick = onclick;
    if (style) {
      this.styleClass += ' ' + style;
    }
  }
}
