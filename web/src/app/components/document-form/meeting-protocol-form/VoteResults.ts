export class VoteResults {

  accepted: number = 0;
  rejected: number = 0;
  isAcceptedByChairman: boolean = false;

  isAccepted() {
    return this.accepted > this.rejected || this.accepted == this.rejected && this.isAcceptedByChairman;
  }

  getVoted() {
    return this.accepted + this.rejected;
  }

  validate(total: number = this.getVoted()) {
    if (this.accepted < 0 || this.rejected < 0) {
      throw 'Количество проголосовавших не может быть отрицательным.';
    }
    if (total != this.getVoted()) {
      throw 'Количество проголосовавших по объекту экспертизы не везде одинаково.';
    }
  }
}
