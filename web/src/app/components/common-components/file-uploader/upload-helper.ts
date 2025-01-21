import {OnInit} from "@angular/core";
import {FileUploader} from "ng2-file-upload";
import {AuthService} from "@app/services/auth.service";

export abstract class UploadHelper implements OnInit {

  fileUploader: FileUploader;
  progressValue: number = 0;
  file: File;

  constructor(protected _authService: AuthService) {
    this.fileUploader = new FileUploader({
      authToken: _authService.getToken(),
      autoUpload: true,
    });
  }

  ngOnInit(): void {
  }

  onSuccess: any = () => {
  };
  onError: any = () => {
  };
  onProgress: any = (fileItem: any, progress: any) => {
    this.progressValue = progress;
  };

  getOptions() {
    return {};
  }

  abstract getUrl(): string;

  saveFile() {
    this.fileUploader.onSuccessItem = this.onSuccess;
    this.fileUploader.onProgressItem = this.onProgress;
    this.fileUploader.onErrorItem = this.onError;
    this.fileUploader.options.url = this.getUrl();
    this.fileUploader.addToQueue([this.file], this.getOptions());
  }
}
