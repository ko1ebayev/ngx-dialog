import { InjectionToken, Provider } from '@angular/core';
import { INgxZeroDialogConfig } from '../models/ngx-zero-dialog-config.interface';

export const NGX_ZERO_DIALOG_CONFIG = new InjectionToken<INgxZeroDialogConfig>(
  'NGX_ZERO_DIALOG_CONFIG'
);
export const provideNgxZeroDialog = (
  config: INgxZeroDialogConfig
): Provider => {
  return {
    provide: NGX_ZERO_DIALOG_CONFIG,
    useValue: config,
  };
};
