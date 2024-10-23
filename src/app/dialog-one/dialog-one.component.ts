import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DialogRef } from '../../../projects/ngx-dialog/src/lib/dialog-ref';
import { NGX_DIALOG_REF } from '../../../projects/ngx-dialog/src/public-api';

@Component({
  standalone: true,
  selector: 'app-dialog-one',
  templateUrl: 'dialog-one.component.html',
  styleUrl: 'dialog-one.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class DialogOneComponent {
  constructor(@Inject(NGX_DIALOG_REF) readonly dialogRef: DialogRef) {}

  ngOnInit() {
    
  }

  close(result?: any) {
    this.dialogRef.close(result);
  }
}
