import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
} from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxZeroDialogService } from '../../../projects/ngx-zero-dialog/src/public-api';
import { AppDialogHostComponent } from '../app-dialog-host/app-dialog-host.component';

@Component({
  standalone: true,
  selector: 'app-template-example',
  templateUrl: 'template-example.component.html',
  styleUrl: 'template-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TemplateExampleComponent {
  private readonly ngxZeroDialogService = inject(NgxZeroDialogService);

  readonly countryCtrl = new FormControl('');

  openTemplateBasedDialog(templateRef: TemplateRef<unknown>) {
    this.ngxZeroDialogService
      .openDialog(templateRef, {
        hostComponent: AppDialogHostComponent,
        hostData: {
          title: 'Template-based dialog',
        },
        dialogData: {
          country: this.countryCtrl.value,
        },
      })
      .subscribe();
  }
}
