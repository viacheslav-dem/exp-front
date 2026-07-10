import {IdDto} from "@app/dto/IdDto";

export class MaintenanceWindowDto extends IdDto {
  enabled: boolean = false;
  startAt: number | null = null;
  endAt: number | null = null;
  message: string = "";
}
