import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {IdDto} from "@app/dto/IdDto";

export interface AuditRecordDto {
  id: number;
  date: string;
  person?: PersonPlainDto;
  type: string;
  message: string;

  // НОВЫЕ ПОЛЯ
  sourceName?: string;
  sourceIp?: string;
  hostIp?: string;
  operationStartTime?: string;
  operationEndTime?: string;
}
