import { Injectable } from '@angular/core';
import { DialogService } from '../../projects/ngx-dialog/src/public-api';
import { DialogOneComponent } from './dialog-one/dialog-one.component';

@Injectable({ providedIn: 'root' })
export class AppDialogService {
  constructor(private readonly dialogService: DialogService) {}

  openDialogOne() {
    return this.dialogService.openDialog(
      DialogOneComponent,
      { config: {} },
      { data: {} }
    );
  }
}
