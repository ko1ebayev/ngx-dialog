import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxDialogService } from '../../../../projects/ngx-zero-dialog/src/public-api';
import { CodeSnippetComponent } from '../../code-snippet/code-snippet.component';
import { MyDialogComponent } from '../component-modals-example/my-dialog.component';
import { CustomHostComponent } from './custom-host/custom-host.component';

@Component({
    standalone: true,
    selector: 'app-host-component-example',
    templateUrl: 'host-component-example.component.html',
    styleUrl: 'host-component-example.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, CodeSnippetComponent, MatTabsModule]
})

export class HostComponentExampleComponent implements OnInit {
    readonly customHostComponentCode = `
        @Component({
            standalone: true,
            selector: 'my-custom-host',
            template: \`
                <div class="custom-host-header">
                    {{ config.customTitle }}

                    <div (click)="close()">close</div>
                </div>
                <ng-template ngxDialogContent></ng-template>
            \`,
            styleUrl: 'dialog-host.component.scss',
            changeDetection: ChangeDetectionStrategy.OnPush,
            imports: [NgxDialogContentDirective, CommonModule],
        })
        export class MyCustomHostComponent extends NgxDialogHost {
            constructor() {
                super();
            }

            close() {
                this.dialogRef.close(undefined);
            }
        }        
    `;

    readonly openDialogWithCustomHostCode = `
        const config: DialogConfig = {
            data: { foo: 'foo', bar: 'bar' } ,
            hostComponent: MyCustomHostComponent,
            customTitle: 'Custom title',
        };

        this.ngxDialogService.openDialog(MyDialogComponent, config);
    `
    constructor(private readonly ngxDialogService: NgxDialogService) { }

    ngOnInit() { }

    openDialogWithCustomHost() {
        this.ngxDialogService.openDialog(MyDialogComponent, {
            hostComponent: CustomHostComponent,
            customTitle: 'Hey!',
            data: { foo: 'foo', bar: 'bar' }
        } as any).subscribe();
    }
}