import { InjectionToken, Provider } from '@angular/core';

export const NGX_DIALOG = new InjectionToken('NGX_DIALOG');
export const provideNgxDialog = (config: { hostID: string, htmlDialogClass?: string }): Provider => {
  return {
    provide: NGX_DIALOG,
    useValue: config,
  };
};
