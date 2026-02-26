import { DocType, isZipFile } from './doc-type';

/** Максимальный размер одиночного файла (МБ). Совпадает с бэкендом. */
export const MAX_SINGLE_MB = 10;
/** Максимальный размер архива ZIP (МБ). Совпадает с бэкендом. */
export const MAX_ZIP_MB = 50;

const BYTES_PER_MB = 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Нормализует typesAccept (строка или массив) в массив MIME-типов/расширений.
 */
export function normalizeTypesAccept(accept: string | string[] | undefined): string[] {
  if (accept == null) return [];
  return Array.isArray(accept)
    ? accept
    : (accept as string).split(',').map((s: string) => s.trim());
}

/**
 * Проверяет тип и размер файлов перед загрузкой.
 * Возвращает { valid: false, message } при первой ошибке.
 */
export function validateFilesForUpload(
  files: File[],
  typesAccept: string | string[] | undefined
): FileValidationResult {
  if (!files?.length) {
    return { valid: true };
  }
  const allowedTypes = normalizeTypesAccept(typesAccept);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const typeAllowed =
      allowedTypes.indexOf(file.type) !== -1 ||
      (isZipFile(file) && allowedTypes.indexOf(DocType.ZIP.extension) !== -1);
    if (!typeAllowed) {
      return {
        valid: false,
        message: 'Выбран файл недопустимого типа: ' + (file.name || 'файл'),
      };
    }
    const isZip = isZipFile(file);
    const maxBytes = isZip ? MAX_ZIP_MB * BYTES_PER_MB : MAX_SINGLE_MB * BYTES_PER_MB;
    if (file.size > maxBytes) {
      return {
        valid: false,
        message: isZip ? 'Архив более 50 Мб' : 'Ваш файл превышает разрешённый размер в 10 Мб',
      };
    }
  }
  return { valid: true };
}
