import { Injectable, TemplateRef } from '@angular/core';
import { NgxDialogService } from '../../projects/ngx-dialog/src/public-api';
import { DialogOneComponent } from './dialog-one/dialog-one.component';

@Injectable({ providedIn: 'root' })
export class AppDialogService {
  constructor(private readonly dialogService: NgxDialogService) {}

  open(templateRef: TemplateRef<unknown>) {
    return this.dialogService.openDialog(templateRef, { foo: 'foo' }, { bar: 'bar' });
  }

  openDialogOne() {
    return this.dialogService.openDialog(
      DialogOneComponent,
    );
  }
}
