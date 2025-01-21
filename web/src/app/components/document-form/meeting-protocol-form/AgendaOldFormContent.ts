import {VoteResults} from "./VoteResults";
import {FormContent} from "@app/components/document-form/form-model/FormContent";

export class AgendaOldFormContent extends FormContent {
  accepted: boolean;
  voted: number;
  customerReplies: string;
  finance = new VoteResults();
  promotion = new VoteResults();
  registration = new VoteResults();
  realization = new VoteResults();
  organization = new VoteResults();
  export = new VoteResults();
  novelty = new VoteResults();
  innovativeness = new VoteResults();
  hightech = new VoteResults();
  scientificLevel = new VoteResults();
  accordance = new VoteResults();
  effectAccordance = new VoteResults();
  stages: string[];
  stagesVotes = new VoteResults();
  privacyObjects: string[];
  privacy = new VoteResults();
  isRescheduled: boolean;
  rescheduled = new VoteResults();
}
