import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxZeroDialogService } from '../../../../projects/ngx-zero-dialog/src/public-api';
import { CodeSnippetComponent } from '../../code-snippet/code-snippet.component';
import { MyDialogWithDataComponent } from './my-dialog-with-data.component';

@Component({
    selector: 'app-dialog-data-example',
    templateUrl: 'dialog-data-example.component.html',
    styleUrl: 'dialog-data-example.component.scss',
    standalone: true,
    imports: [CommonModule, MatTabsModule, CodeSnippetComponent]
})

export class DialogDataExampleComponent {
    readonly openDialogWithDataCode = `
        const config: DialogConfig = {
            closeOnBackdropClick: false,
            data: {
                foo: 'foo',
                bar: 'bar',
                baz: 'baz',
            }
        }

        this.ngxDialogService.openDialog(DialogWithDataComponent, config).subscribe();
    `;

    readonly dialogWithDataComponentCode = `
        @Component({
            selector: 'app-my-dialog.component.ts',
            template: \`
                Hello! I'm component dialog <br> 
                Here is data you provided: <br>
                {{ data | json }}
            \`
        })
        export class MyDialogComponent {
            constructor(
                @Inject(NGX_DIALOG_DATA) 
                readonly dialogData: { foo: string, bar: string, baz: string }
            ) { }
        }
    `


    constructor(private readonly ngxDialogService: NgxZeroDialogService) { }

    openDialogWithData() {
        this.ngxDialogService.openDialog(MyDialogWithDataComponent, {
            data: { foo: 'foo', bar: 'bar', baz: 'baz' }
        }).subscribe();
    }
}