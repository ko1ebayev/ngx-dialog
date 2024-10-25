import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideNgxDialog } from '../../projects/ngx-dialog/src/public-api';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNgxDialog({ hostID: 'ngx-dialog-host', htmlDialogClass: 'my-class' }),
  ],
};
