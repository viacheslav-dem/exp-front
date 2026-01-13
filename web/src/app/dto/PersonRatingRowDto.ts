import {PersonDto} from "@app/dto/PersonDto";
import {ReviewScoreRowDto} from "@app/dto/ReviewScoreRowDto";

export class PersonRatingRowDto {
    person: PersonDto;
    total: number;
    reviewsCount: number;
    reviews: ReviewScoreRowDto[];
    isExtandable: boolean = false;
}