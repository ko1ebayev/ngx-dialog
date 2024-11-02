import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';

import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { provideNgxDialog } from '../../projects/ngx-zero-dialog/src/public-api';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
    }), provideAnimationsAsync(),

    provideNgxDialog({ hostID: 'ngx-dialog-host' }),

    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: 100 }}
  ],
};
