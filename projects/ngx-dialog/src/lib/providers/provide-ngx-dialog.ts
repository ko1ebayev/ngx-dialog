import { InjectionToken, Provider } from '@angular/core';
import { NgxDialog } from '../interfaces/ngx-dialog-config.interface';

export const NGX_DIALOG = new InjectionToken('NGX_DIALOG');
export const provideNgxDialog = (baseConfig: NgxDialog): Provider => {
  return {
    provide: NGX_DIALOG,
    useFactory: () => {
      return baseConfig;
    },
  };
};
