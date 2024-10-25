import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewChild
} from '@angular/core';

import { DialogRef } from '../dialog-ref';
import { NGX_DIALOG_REF } from '../providers/dialog-ref.token';
import { NgxDialogContentDirective } from './dialog-content.directive';

@Component({
  standalone: true,
  selector: 'ngx-dialog-host',
  templateUrl: 'dialog-host.component.html',
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxDialogContentDirective],
})
export class NgxDialogHostComponent {
  @ViewChild(NgxDialogContentDirective, { static: true })
  contentInsertionPoint!: NgxDialogContentDirective;

  constructor(@Inject(NGX_DIALOG_REF) readonly dialogRef: DialogRef) {
    this.closeOnBackdropClick();
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
