import {TransitionHistoryDto} from "@app/dto/TransitionHistoryDto";
import {ProjectLifecycleTransitionHistoryDto} from "@app/dto/ProjectLifecycleTransitionHistoryDto";

export class LifecycleGroupTransitionHistoryDto extends TransitionHistoryDto {
  lifecycleHistories: ProjectLifecycleTransitionHistoryDto[];
}
