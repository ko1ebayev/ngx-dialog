import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-overview',
    templateUrl: 'overview.component.html',
    styleUrl: 'overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})

export class OverviewComponent {}