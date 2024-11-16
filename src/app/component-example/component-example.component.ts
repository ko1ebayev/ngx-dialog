import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxZeroDialogService } from '../../../projects/ngx-zero-dialog/src/public-api';
import { AppDialogHostComponent } from '../app-dialog-host/app-dialog-host.component';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  standalone: true,
  selector: 'app-component-example',
  templateUrl: 'component-example.component.html',
  styleUrl: 'component-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class ComponentExampleComponent {
  private readonly ngxZeroDialogService = inject(NgxZeroDialogService);

  readonly nameCtrl = new FormControl('');

  openComponentBasedDialog() {
    this.ngxZeroDialogService
      .openDialog(DialogComponent, {
        hostComponent: AppDialogHostComponent,
        hostData: {
          title: 'Component-based dialog',
        },
        dialogData: {
          name: this.nameCtrl.value,
        },
      })
      .subscribe((result) => alert(result));
  }
}
