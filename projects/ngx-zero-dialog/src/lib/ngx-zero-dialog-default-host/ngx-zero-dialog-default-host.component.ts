import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DialogContentDirective } from '../dialog-content.directive';
import { NgxZeroDialogHost } from '../ngx-zero-dialog-host';

@Component({
  standalone: true,
  selector: 'ngx-zero-dialog-host',
  templateUrl: 'ngx-zero-dialog-default-host.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogContentDirective],
  host: {
    class: 'ngx-zero-dialog-host',
  },
})
export class NgxZeroDialogDefaultHost extends NgxZeroDialogHost {
  constructor() {
    super();
  }

  close() {
    this.dialogRef.close();
  }
}
