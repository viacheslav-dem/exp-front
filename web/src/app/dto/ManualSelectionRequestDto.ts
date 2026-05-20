export class ManualSelectionRequestDto {
    id : number;
    isConfirmed : boolean;
    onConfirmation : boolean;
    rejectionReason : string;
    requestReason : string;
}