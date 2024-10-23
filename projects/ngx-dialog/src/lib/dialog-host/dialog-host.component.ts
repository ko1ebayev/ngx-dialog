import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxDialogContentDirective } from './dialog-content.directive';
import { DialogRootBase } from './dialog-root-base';

@Component({
  standalone: true,
  selector: 'ngx-dialog-host',
  templateUrl: 'dialog-host.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxDialogContentDirective],
})
export class NgxDialogHostComponent extends DialogRootBase {}
