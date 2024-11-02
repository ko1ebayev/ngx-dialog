import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrl: 'footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})

export class FooterComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}