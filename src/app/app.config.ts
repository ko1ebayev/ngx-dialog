import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { provideNgxZeroDialog } from 'ngx-zero-dialog';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
    }),
    provideAnimationsAsync(),
    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: 100 } },

    // provide Ngx-zero-dialog config
    provideNgxZeroDialog({
      containerNodeID: 'ngx-zero-dialog-container',
      enableAnimations: true,
    }),
  ],
};
