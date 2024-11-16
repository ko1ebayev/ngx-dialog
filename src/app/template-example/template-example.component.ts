import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    TemplateRef,
} from '@angular/core';

import { NgxZeroDialogService } from '../../../projects/ngx-zero-dialog/src/public-api';
import { AppDialogHostComponent } from '../app-dialog-host/app-dialog-host.component';

@Component({
  selector: 'app-template-example',
  templateUrl: 'template-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class TemplateExampleComponent {
  private readonly ngxZeroDialogService = inject(NgxZeroDialogService);

  openTemplateBasedDialog(templateRef: TemplateRef<unknown>) {
    this.ngxZeroDialogService
      .openDialog(templateRef, {
        hostComponent: AppDialogHostComponent,
        hostData: {
          title: 'Template based dialog',
        },
        dialogData: {},
      })
      .subscribe();
  }
}
