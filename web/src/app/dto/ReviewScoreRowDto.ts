import {ScoreItemDto} from "@app/dto/ScoreItemDto";

export class ReviewScoreRowDto {
    reviewId: number;
    projectCode: string;
    total: number;
    items: ScoreItemDto[];
}