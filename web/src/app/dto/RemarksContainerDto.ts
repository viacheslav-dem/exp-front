import {RemarkDto} from "@app/dto/RemarkDto";
import {IdDto} from "@app/dto/IdDto";

export class RemarksContainerDto {
  expertRemarks: RemarkDto[] = [];
  sectionMeetingRemark: RemarkDto[] = [];
  bureauMeetingRemark: RemarkDto[] = [];
  project: IdDto;
  meeting: IdDto;
}
