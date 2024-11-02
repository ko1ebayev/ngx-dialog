import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { NGX_DIALOG_DATA } from '../../../../projects/ngx-dialog/src/public-api';

@Component({
    standalone: true,
    selector: 'app-my-dialog-with-data.component.ts',
    template: `
        Hello! I'm component dialog <br>
        Here is data you provided: <br>
        {{ data | json }}
    `,
    imports: [CommonModule]
})

export class MyDialogWithDataComponent {
    constructor(@Inject(NGX_DIALOG_DATA) readonly data: { foo: string, bar: string, baz: string}) { }
}