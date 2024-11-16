import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DIALOG_DATA, DIALOG_REF } from 'ngx-zero-dialog';


export interface ComponentDialogData {
  name: string;
}

export type ComponentDialogResult = string;

@Component({
  standalone: true,
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrl: 'dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class DialogComponent {
  readonly data = inject<ComponentDialogData>(DIALOG_DATA);

  private readonly dialogRef = inject(DIALOG_REF);

  private readonly result = signal('');

  setResult(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.result.set(value);
  }

  close() {
    this.dialogRef.close(this.result());
  }
}
