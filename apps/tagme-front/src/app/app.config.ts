import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideProtractorTestingSupport } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { paginationFeature } from './routes/home/stores/pagination/reducers/pagination.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideProtractorTestingSupport(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({ [ paginationFeature.name ]: paginationFeature.reducer })
  ]
};
