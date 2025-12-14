import './polyfills.ts';

// Required for Bootstrap 5 data-* APIs (dropdown/collapse/etc.)
import 'bootstrap/dist/js/bootstrap.bundle';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from "./app/app.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
  .catch(err => console.error(err));

