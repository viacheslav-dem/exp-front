export class ExpertReviewStatsDto {
    id: number;
    personId: number;
    projectId: number;
    percent: number;
    coefficient: number;
    finalStats: number;
    rejected: boolean;
    economist: boolean;
}