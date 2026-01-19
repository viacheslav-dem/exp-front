export class ActionButtonMetadata {
  title: string;
  styleClass: string = 'btn btn-sm';
  onclick: any;
  key?: string;
  isLoading?: () => boolean;
  isDisabled?: () => boolean;

  constructor(
    title: string,
    onclick: any,
    style?: string,
    options?: {
      key?: string;
      isLoading?: () => boolean;
      isDisabled?: () => boolean;
    }
  ) {
    this.title = title;
    this.onclick = onclick;
    if (style) {
      this.styleClass += ' ' + style;
    }
    if (options) {
      this.key = options.key;
      this.isLoading = options.isLoading;
      this.isDisabled = options.isDisabled;
    }
  }
}
