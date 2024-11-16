import { Component } from '@angular/core';
import { DialogContentDirective, NgxZeroDialogHost } from 'ngx-zero-dialog';

interface AppDialogHostData {
  title: string;
}

@Component({
  standalone: true,
  selector: 'app-dialog-host',
  templateUrl: 'app-dialog-host.component.html',
  styleUrl: 'app-dialog-host.component.scss',
  imports: [DialogContentDirective],
})
export class AppDialogHostComponent extends NgxZeroDialogHost<AppDialogHostData> {
  constructor() {
    super();
  }

  close() {
    this.dialogRef.close();
  }
}
