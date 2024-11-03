import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogContentDirective, NgxZeroDialogHost } from '../../../../../projects/ngx-zero-dialog/src/lib';

@Component({
    selector: 'app-custom-host',
    templateUrl: 'custom-host.component.html',
    styleUrl: 'custom-host.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DialogContentDirective]
})
export class CustomHostComponent extends NgxZeroDialogHost {
    constructor() {
        super();
    }

    ngOnInit() { }

    close() {
        this.dialogRef.close();
    }
}