import { Injector } from '@angular/core';
import { DialogRef } from '../dialog-ref';
import { DialogConfig } from '../interfaces/dialog-config.interface';
import { NGX_DIALOG_CONFIG } from '../providers/dialog-config.token';
import { NGX_DIALOG_DATA } from '../providers/dialog-data.token';
import { NGX_DIALOG_REF } from '../providers/dialog-ref.token';

export const createDialogInjector = (
  parentInjector: Injector,
  tokens: {
    dialogRef?: DialogRef<unknown>;
    dialogConfig?: DialogConfig;
    data: any;
  }
): Injector => {
  return Injector.create({
    parent: parentInjector,
    providers: [
      {
        provide: NGX_DIALOG_REF,
        useValue: tokens.dialogRef,
      },
      {
        provide: NGX_DIALOG_CONFIG,
        useValue: tokens.dialogConfig,
      },
      {
        provide: NGX_DIALOG_DATA,
        useValue: tokens.data,
      },
    ],
  });
};
