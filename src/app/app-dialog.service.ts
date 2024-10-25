import { Injectable } from '@angular/core';
import { NgxDialogService } from '../../projects/ngx-dialog/src/public-api';
import { DialogOneComponent } from './dialog-one/dialog-one.component';

@Injectable({ providedIn: 'root' })
export class AppDialogService {
  constructor(private readonly dialogService: NgxDialogService) {}

  openDialogOne() {
    return this.dialogService.openDialog(
      DialogOneComponent,
    );
  }
}
