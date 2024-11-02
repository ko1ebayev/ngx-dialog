import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-my-dialog.component.ts',
    template: `
        Hello! I'm component dialog <br> Close me if you wish
    `
})

export class MyDialogComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}