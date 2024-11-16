import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  TemplateRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxZeroDialogService } from 'ngx-zero-dialog';

import { MatTabsModule } from '@angular/material/tabs';
import { CodeSnippetComponent } from '../components/code-snippet/code-snippet.component';
import { ShowCodeBtnComponent } from '../components/show-code-btn/show-code-btn.component';
import { DialogHostComponent } from './dialog-host/dialog-host.component';

@Component({
  standalone: true,
  selector: 'app-template-example',
  templateUrl: 'template-example.component.html',
  styleUrl: 'template-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShowCodeBtnComponent,
    MatTabsModule,
    CodeSnippetComponent,
  ],
})
export class TemplateExampleComponent {
  private readonly ngxZeroDialogService = inject(NgxZeroDialogService);

  readonly countryCtrl = new FormControl('');

  readonly mode = signal<'code' | 'demo'>('demo');

  readonly htmlCode = `
    <input
      type="text"
      [formControl]="countryCtrl"
      placeholder="Where are you from?"
    />
    <button (click)="openTemplateBasedDialog(dialogTemplate)">Open dialog</button>

    <ng-template #dialogTemplate let-dialogRef let-data="data">
      Your country is {{ data.country }}
      <button (click)="dialogRef.close()">Close</button>
    </ng-template>
  `;

  readonly tsCode = `
    @Component({
      ...
    })
    export class TemplateExampleComponent {
      private readonly ngxZeroDialogService = inject(NgxZeroDialogService);

      readonly countryCtrl = new FormControl('');

      openTemplateBasedDialog(templateRef: TemplateRef<unknown>) {
        this.ngxZeroDialogService
          .openDialog(templateRef, {
            hostComponent: DialogHostComponent,
            hostData: {
              title: 'Template-based dialog',
              closable: false,
            },
            dialogData: {
              country: this.countryCtrl.value,
            },
          })
          .subscribe();
      }
    }
  `;

  readonly dialogHostCode = `
    interface DialogHostData {
      title: string;
      closable?: boolean;
    }

    @Component({
      standalone: true,
      selector: 'app-dialog-host',
      template: \`
        <div class="title">
          {{ hostData.title }}
          <img *ngIf="hostData.closable ?? true" src="close.svg" (click)="close()">
        </div>
        <div class="content">
          <ng-template dialogContent></ng-template>
        </div>

      \`,
      styleUrl: 'dialog-host.component.scss',
      imports: [DialogContentDirective, CommonModule],
    })
    export class DialogHostComponent extends NgxZeroDialogHost<DialogHostData> {
      constructor() {
        super();
      }

      close() {
        this.dialogRef.close();
      }
    }
  `;

  openTemplateBasedDialog(templateRef: TemplateRef<unknown>) {
    this.ngxZeroDialogService
      .openDialog(templateRef, {
        hostComponent: DialogHostComponent,
        hostData: {
          title: 'Template-based dialog',
          closable: false,
        },
        dialogData: {
          country: this.countryCtrl.value,
        },
      })
      .subscribe();
  }

  toggleCode() {
    this.mode.set(this.mode() === 'code' ? 'demo' : 'code');
  }
}
