import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgxDialogContentDirective } from './dialog-content.directive';
import { NgxDialogHost } from './dialog-host.directive';

@Component({
  standalone: true,
  selector: 'ngx-dialog-host',
  templateUrl: 'dialog-host.component.html',
  styleUrl: 'dialog-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxDialogContentDirective],
})
export class NgxDialogHostComponent extends NgxDialogHost {
  constructor() {
    super();
  }

  close() {
    this.dialogRef.close(undefined);
  }
  // @ViewChild(NgxDialogContentDirective, { static: true })
  // contentInsertionPoint!: NgxDialogContentDirective;

  // constructor(
  //   @Inject(NGX_DIALOG_REF) readonly dialogRef: DialogRef,
  //   @Inject(NGX_DIALOG_CONFIG) readonly dialogConfig: DialogConfig
  // ) {
  //   if (dialogConfig.closeOnBackdropClick) {
  //     this.closeOnBackdropClick();
  //   }
  // }

  // private closeOnBackdropClick() {
  //   this.dialogRef.nativeDialog.addEventListener('click', (event) => {
  //     const rect = this.dialogRef.nativeDialog.getBoundingClientRect();
  //     const isInDialog =
  //       rect.top <= event.clientY &&
  //       event.clientY <= rect.top + rect.height &&
  //       rect.left <= event.clientX &&
  //       event.clientX <= rect.left + rect.width;

  //     if (!isInDialog) {
  //       this.dialogRef.close(undefined);
  //     }
  //   });
  // }
}
