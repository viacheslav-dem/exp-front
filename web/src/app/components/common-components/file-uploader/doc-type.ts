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
  ZIP: new DocTypeInfo('application/zip', '.zip'),
  OTHER: new DocTypeInfo('', ''),
};

/** Считаем файл архивом по Content-Type; итоговая проверка — на бэкенде (UploadedDocumentValidator). */
export function isZipFile(file: { type: string } | null): boolean {
  if (!file?.type) return false;
  const t = file.type.trim().toLowerCase();
  return t === 'application/zip' || t === 'application/x-zip-compressed';
}
