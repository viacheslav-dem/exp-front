export class ConfirmDialogField<T> {
  type: string = 'text';
  name: string;
  label: string;
  value: T;

  constructor(name: string, label: string, type?: string) {
    this.name = name;
    this.label = label;
    if (type != null)
      this.type = type;
  }
}