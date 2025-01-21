import {DocumentDto} from "@app/dto/DocumentDto";
import {ProjectLifecycleDto} from "@app/dto/ProjectLifecycleDto";
import {HasState} from "@app/dto/HasState";
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";
import {RemarkDto} from "@app/dto/RemarkDto";
import {DecisionState} from "@app/pipes/decision.pipe";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";

export class LifecycleGroupDto extends HasState {
  council: CouncilPlainDto;
  referral: DocumentDto;
  conclusion: DocumentDto;
  decisionDocument: DocumentDto;
  lifecycles: ProjectLifecycleDto[];
  meetingProtocol: DocumentDto[];
  returnReason: string;
  bureauChairman: PersonPlainDto;
  isAnswerReceived: boolean;
  remarks: RemarkDto[] = [];
  remarkDocuments: DocumentDto[] = [];
  finalAgendaState: DecisionState;
}
