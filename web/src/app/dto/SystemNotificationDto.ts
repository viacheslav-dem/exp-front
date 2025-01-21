import {IdDto} from "@app/dto/IdDto";

export class SystemNotificationDto extends IdDto {
    name: string = "";
    message: string = "";
    type: string = "";
    enabled: boolean = false;
}
