import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxDialogContentDirective } from '../../../../../projects/ngx-zero-dialog/src/lib/dialog-host/dialog-content.directive';
import { NgxDialogHost } from '../../../../../projects/ngx-zero-dialog/src/lib/dialog-host/dialog-host.directive';

@Component({
    selector: 'app-custom-host',
    templateUrl: 'custom-host.component.html',
    styleUrl: 'custom-host.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, NgxDialogContentDirective]
})
export class CustomHostComponent extends NgxDialogHost {
    constructor() {
        super();
    }

    ngOnInit() { }

    close() {
        this.dialogRef.close(undefined);
    }
}