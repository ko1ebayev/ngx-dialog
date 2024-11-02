import { Directive, inject, ViewChild } from '@angular/core';

import { DialogContentDirective } from './dialog-content.directive';
import { DIALOG_CONFIG } from './providers/dialog-config.token';
import { DIALOG_REF } from './providers/dialog-ref.token';

@Directive()
export class NgxZeroDialogHost {
  @ViewChild(DialogContentDirective, { static: true })
  contentInsertionPoint!: DialogContentDirective;

  readonly dialogRef = inject(DIALOG_REF);

  readonly dialogConfig = inject(DIALOG_CONFIG) as any;

  constructor() {
    if (this.dialogConfig.closeOnBackdropClick) {
      this.closeOnBackdropClick();
    }
  }

  private closeOnBackdropClick() {
    this.dialogRef.nativeDialog.addEventListener('click', (event) => {
      const rect = this.dialogRef.nativeDialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        this.dialogRef.close(undefined);
      }
    });
  }
}
