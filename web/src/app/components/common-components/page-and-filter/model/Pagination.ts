export class Pagination {
  public page: number = 1;
  public itemsPerPage: number = 15;

  constructor(itemsPerPage?: number) {
    if (itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
    }
  }
}
