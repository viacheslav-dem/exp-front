import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {DocumentDto} from "@app/dto/DocumentDto";
import {HasState} from "@app/dto/HasState";
import {AccountingPlainDto} from "@app/dto/AccountingPlainDto";
import {ExpertReviewState} from "@app/pipes/review-state.pipe";

export class ExpertReviewDto extends HasState {
  expert: PersonPlainDto;
  accounting: AccountingPlainDto;
  documents: DocumentDto[];
  rejectionReason: string;
  reviewScan: DocumentDto;
  expectedState: ExpertReviewState;
}
