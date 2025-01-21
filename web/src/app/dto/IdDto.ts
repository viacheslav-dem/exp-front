export class IdDto {

  id: number = 0;

  constructor(id?: number) {
    if (id) {
      this.id = id;
    }
  }
}
