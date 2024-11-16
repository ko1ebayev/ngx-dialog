import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxZeroDialogService } from 'ngx-zero-dialog';

import { MatTabsModule } from '@angular/material/tabs';
import { CodeSnippetComponent } from '../components/code-snippet/code-snippet.component';
import { ShowCodeBtnComponent } from '../components/show-code-btn/show-code-btn.component';
import { DialogHostComponent } from './dialog-host/app-dialog-host.component';
import {
  ComponentDialogResult,
  DialogComponent,
} from './dialog/dialog.component';

@Component({
  standalone: true,
  selector: 'app-component-example',
  templateUrl: 'component-example.component.html',
  styleUrl: 'component-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatTabsModule,
    ShowCodeBtnComponent,
    CodeSnippetComponent,
  ],
})
export class ComponentExampleComponent {
  private readonly ngxZeroDialogService = inject(NgxZeroDialogService);

  readonly nameCtrl = new FormControl('');

  readonly mode = signal<'demo' | 'code'>('demo');

  readonly result = signal<ComponentDialogResult | undefined>('');

  readonly htmlCode = `
    <input type="text" [formControl]="nameCtrl" placeholder="What's your name?" />
    <button (click)="openComponentBasedDialog()">Open dialog</button>
  `;

  readonly tsCode = `
    @Component({
      ...
    })
    export class ComponentDialogExample {
      private readonly ngxZeroDialogService = inject(NgxZeroDialogService);

      readonly nameCtrl = new FormControl('');

      openComponentBasedDialog() {
        this.ngxZeroDialogService
          .openDialog<ComponentDialogResult>(DialogComponent, {
            hostComponent: AppDialogHostComponent,
            hostData: {
              title: 'Component-based dialog',
            },
            dialogData: {
              name: this.nameCtrl.value,
            },
          })
          .subscribe((result) => alert(\`You answered: {result}\`));
      }
    }


    export interface ComponentDialogData { name: string; }
    export type ComponentDialogResult = string;

    @Component({
      standalone: true,
      selector: 'app-dialog',
      templateUrl: 'dialog.component.html',
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
  `;

  readonly dialogTemplateCode = `
    <div class="greetings">Hello, {{ data.name }}</div>
    <input
      type="text"
      placeholder="How old are you?"
      (input)="setResult($event)"
    />
    <button (click)="close()">Submit</button>
  `;

  readonly dialogHostCode = `
    interface AppDialogHostData { title: string; }

    @Component({
      standalone: true,
      selector: 'app-dialog-host',
      template: \`
        <div class="title">
          {{ hostData.title }} 
          <img src="close.svg" (click)="close()">
        </div>

        <div class="content">
          <ng-template dialogContent></ng-template>
        </div>
      \`,
      imports: [DialogContentDirective],
    })
    export class DialogHostComponent extends NgxZeroDialogHost<AppDialogHostData> {
      constructor() {
        super();
      }

      close() {
        this.dialogRef.close();
      }
    }
  `;

  openComponentBasedDialog() {
    this.ngxZeroDialogService
      .openDialog<ComponentDialogResult>(DialogComponent, {
        hostComponent: DialogHostComponent,
        hostData: {
          title: 'Component-based dialog',
        },
        dialogData: {
          name: this.nameCtrl.value,
        },
      })
      .subscribe((result) => this.result.set(result));
  }

  toggleCode() {
    this.mode.set(this.mode() === 'code' ? 'demo' : 'code');
  }
}
