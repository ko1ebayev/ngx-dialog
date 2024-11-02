import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CodeSnippetComponent } from '../../code-snippet/code-snippet.component';

@Component({
    selector: 'app-dialog-config-example',
    templateUrl: 'dialog-config-example.component.html',
    styleUrl: 'dialog-config-example.component.scss',
    standalone: true,
    imports: [CommonModule, MatTabsModule, CodeSnippetComponent]
})

export class DialogConfigExampleComponent implements OnInit {
    readonly dialogConfigInterfaceCode = `
        export interface DialogConfig {
            closeOnBackdropClick?: boolean;    // default is TRUE
            htmlDialogClass?: string;          // default is ngx-dialog-class
            data?: DialogData,                 // any data you want to provide in dialog
            hostComponent?: ComponentType<any> // component class
        }
    `;

    readonly specifyConfigCode = `
        const config: DialogConfig = {
            closeOnBackdropClick: false,
            data: { foo: 'foo' },
        };

        this.ngxDialogService.openDialog(MyDialogComponent, config).subscribe();
    `


    constructor() { }

    ngOnInit() { }
}