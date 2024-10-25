import { Injector } from '@angular/core';
import { DialogRef } from './dialog-ref';
import { DialogConfig } from './models/dialog-config.interface';
import { DialogData } from './models/dialog-data.interface';
import { NGX_DIALOG_CONFIG } from './providers/dialog-config.token';
import { NGX_DIALOG_DATA } from './providers/dialog-data.token';
import { NGX_DIALOG_REF } from './providers/dialog-ref.token';

export const createDialogInjector = (
  parentInjector: Injector,
  tokens: {
    dialogRef: DialogRef;
    dialogConfig: DialogConfig;
    data: DialogData;
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
