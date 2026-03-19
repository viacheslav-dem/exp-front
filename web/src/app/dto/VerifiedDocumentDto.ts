import {SigningUserinfoDto} from "@app/dto/SigningUserinfoDto";

export class VerifiedDocumentDto {
    signingUserinfoDtos: SigningUserinfoDto[];
    holistic: boolean;
    message: string;
}
