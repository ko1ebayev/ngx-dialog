import { InjectionToken, Provider } from '@angular/core';
import { ComponentType } from '../interfaces/component-type.interface';

export const NGX_DIALOG_HOST = new InjectionToken('NGX_DIALOG_HOST');
export const provideDialogHost = (component: ComponentType): Provider => {
  return {
    provide: component,
    useClass: component,
  };
};
