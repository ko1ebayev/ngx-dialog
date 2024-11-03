import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DialogContentDirective } from '../dialog-content.directive';
import { NgxZeroDialogHost } from '../ngx-zero-dialog-host';

@Component({
  standalone: true,
  selector: 'ngx-zero-dialog-host',
  templateUrl: 'default-dialog-host.component.html',
  styleUrl: 'default-dialog-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogContentDirective],
})
export class NgxZeroDialogDefaultHost extends NgxZeroDialogHost {
  constructor() {
    super();
  }

  close() {
    this.dialogRef.close();
  }
}
