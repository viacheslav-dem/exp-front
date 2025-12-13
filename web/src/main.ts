import './polyfills.ts';

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

