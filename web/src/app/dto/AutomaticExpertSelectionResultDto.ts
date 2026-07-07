import {ExpertReviewDto} from "@app/dto/ExpertReviewDto";
import {ExpertReviewStatsDto} from "@app/dto/ExpertReviewStatsDto";

export class AutomaticExpertSelectionResultDto {
    expertReviews: ExpertReviewDto[];
    reviewStats: ExpertReviewStatsDto[];
}
