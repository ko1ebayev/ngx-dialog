import { Directive, inject, ViewChild } from '@angular/core';
import { NGX_DIALOG_CONFIG } from '../providers/dialog-config.token';
import { NGX_DIALOG_REF } from '../providers/dialog-ref.token';
import { NgxDialogContentDirective } from './dialog-content.directive';

@Directive()
export class NgxDialogHost {
  @ViewChild(NgxDialogContentDirective, { static: true })
  contentInsertionPoint!: NgxDialogContentDirective;

  readonly dialogRef = inject(NGX_DIALOG_REF);

  readonly config = inject(NGX_DIALOG_CONFIG) as any;

  constructor() {
    if (this.config.closeOnBackdropClick) {
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
