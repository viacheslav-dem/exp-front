import {DecisionState} from "@app/pipes/decision.pipe";

export class NewVoteResults {

  accepted: number = 0;

  rejected: number = 0;

  rescheduled: number = 0;

  notVoted: number = 0;

  chairmanDecision: DecisionState;

  static clone(votes: NewVoteResults): NewVoteResults {
    let votesClone = new NewVoteResults();
    votesClone.accepted = votes.accepted;
    votesClone.rejected = votes.rejected;
    votesClone.rescheduled = votes.rescheduled;
    votesClone.notVoted = votes.notVoted;
    votesClone.chairmanDecision = votes.chairmanDecision;
    return votesClone;
  }

  isAccepted() {
    return this.accepted > this.rescheduled && this.accepted > this.rejected
      || this.accepted >= this.rescheduled && this.accepted >= this.rejected
      && this.chairmanDecision == DecisionState.ACCEPTED;
  }

  isRejected() {
    return this.rejected > this.accepted && this.rejected > this.rescheduled
      || this.rejected >= this.accepted && this.rejected >= this.rescheduled
      && this.chairmanDecision == DecisionState.REJECTED;
  }

  isRescheduled() {
    return this.rescheduled > this.accepted && this.rescheduled > this.rejected
      || this.rescheduled >= this.accepted && this.rescheduled >= this.rejected
      && this.chairmanDecision == DecisionState.RESCHEDULED;
  }

  needChairmanDecision() {
    return !this.isAccepted() && !this.isRejected() && !this.isRescheduled();
  }

  chairmanDecisionDisabled() {
    return this.accepted > this.rejected && this.accepted > this.rescheduled
      || this.rejected > this.accepted && this.rejected > this.rescheduled
      || this.rescheduled > this.accepted && this.rescheduled > this.rejected;
  }

  getVoted() {
    return this.accepted + this.rejected + this.rescheduled;
  }

  getDecision() {
    if (this.isAccepted()) {
      return DecisionState.ACCEPTED;
    } else if (this.isRejected()) {
      return DecisionState.REJECTED;
    } else if (this.isRescheduled()) {
      return DecisionState.RESCHEDULED;
    } else {
      return null;
    }
  }
}
