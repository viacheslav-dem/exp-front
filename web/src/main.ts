import './polyfills.ts';

// Настройка PDF.js worker глобально до инициализации Angular
// ng2-pdf-viewer проверяет window.pdfWorkerSrc или window.pdfWorkerSrc${version} 
// в конструкторе компонента и использует его вместо CDN, если он установлен
if (typeof window !== 'undefined') {
  // Устанавливаем путь к локальному worker файлу
  // Worker файл находится в src/assets/pdf.worker.min.mjs
  // (скопирован из node_modules/ng2-pdf-viewer/node_modules/pdfjs-dist/build/pdf.worker.min.mjs)
  // Для версии 4.8.69 используется формат .mjs
  const workerSrc = '/assets/pdf.worker.min.mjs';
  const win = window as any;
  
  // Устанавливаем общую переменную (приоритет 2 в ng2-pdf-viewer)
  win.pdfWorkerSrc = workerSrc;
  
  // Устанавливаем версию-специфичную переменную для версии 4.8.69 (приоритет 1)
  // ng2-pdf-viewer использует pdfjs-dist@4.8.69 и проверяет window['pdfWorkerSrc4.8.69']
  win['pdfWorkerSrc4.8.69'] = workerSrc;
  
  // ng2-pdf-viewer автоматически использует эти переменные в своем конструкторе
  // и устанавливает GlobalWorkerOptions.workerSrc, поэтому дополнительная настройка не требуется
}

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from './environments/environment';
import { AppModule } from "./app/app.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, { 
    applicationProviders: [
      provideZoneChangeDetection(),
      provideAnimations()
    ]
  })
  .catch(err => console.error(err));

