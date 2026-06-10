import {UserinfoDto} from "@app/dto/UserinfoDto";
import {RecordKeepingDto} from "@app/dto/RecordKeepingDto";

export class SigningUserinfoDto {
    id: number;
    userinfoDto: UserinfoDto;
    signingDate: Date;
    recordKeepingDto: RecordKeepingDto;

    // UI вспомогательные поля
    selectedRecordKeepingId: number | null;
    originalRecordKeepingId: number | null;

    constructor() {
        this.selectedRecordKeepingId = null;
        this.originalRecordKeepingId = null;
    }
}
