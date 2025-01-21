export class DocTypeInfo {

  extension: string;
  suffix: string;

  constructor(extension: string, suffix: string) {
    this.extension = extension;
    this.suffix = suffix;
  }
}

export let DocType = {
  PDF: new DocTypeInfo("application/pdf", ".pdf"),
  DOC: new DocTypeInfo('application/msword', '.doc'),
  DOCX: new DocTypeInfo('application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'),
  TIFF: new DocTypeInfo('image/tiff', '.tiff'),
  XML: new DocTypeInfo('text/xml', '.xml'),
  OTHER: new DocTypeInfo('', ''),
};
