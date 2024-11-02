import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxZeroDialogService } from '../../../../projects/ngx-zero-dialog/src/public-api';
import { CodeSnippetComponent } from '../../code-snippet/code-snippet.component';

@Component({
  standalone: true,
  selector: 'app-template-modals-example',
  templateUrl: 'template-modals-example.component.html',
  styleUrl: 'template-modals-example.component.scss',
  imports: [CommonModule, MatTabsModule, CodeSnippetComponent],
})
export class TemplateModalsExampleComponent {
    readonly appComponentCode = `
        @Component({
            selector: 'app-component',
            template: \`
                <button (click)="openDialog(dialogTpl)">Open template-based dialog</button>

                <ng-template #dialogTpl>Hello! I'm component template <br> Close me if you wish</ng-template>
            \`,
            styleUrl: './app.component.scss',
        })
        export class AppComponent {
            constructor(private readonly ngxDialogService: NgxDialogService) {}

            openDialog(dialogTpl: TemplateRef<unknown>) {
                this.ngxDialogService.openDialog(dialogTpl).subscribe();
            }
        }
    `;

  constructor(private readonly ngxDialogService: NgxZeroDialogService) {}

  openDialog(dialogTpl: TemplateRef<unknown>) {
    this.ngxDialogService.openDialog(dialogTpl).subscribe();
  }
}
