import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { NgxZeroDialogService } from '../../../projects/ngx-zero-dialog/src/public-api';
import { AppDialogHostComponent } from '../app-dialog-host/app-dialog-host.component';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  standalone: true,
  selector: 'app-component-example',
  templateUrl: 'component-example.component.html',
  styleUrl: 'component-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentExampleComponent {
  private readonly ngxZeroDialogService = inject(NgxZeroDialogService);

  private readonly name = signal('Stranger');

  openComponentBasedDialog() {
    this.ngxZeroDialogService
      .openDialog(DialogComponent, {
        hostComponent: AppDialogHostComponent,
        hostData: {
          title: 'Component-based dialog',
        },
        dialogData: {
          name: this.name(),
        },
      })
      .subscribe((result) => alert(result));
  }

  setName(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.name.set(value);
  }
}
