import {TransitionHistoryDto} from "@app/dto/TransitionHistoryDto";
import {ProjectLifecycleTransitionHistoryDto} from "@app/dto/ProjectLifecycleTransitionHistoryDto";
import {ExpertTransitionHistoryDto} from "@app/dto/ExpertTransitionHistoryDto";

export class ProjectTransitionHistoryDto extends TransitionHistoryDto {
  groupHistories: ProjectLifecycleTransitionHistoryDto[];
  expertHistories: ExpertTransitionHistoryDto[];
}
