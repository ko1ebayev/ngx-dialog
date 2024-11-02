import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-toc',
  templateUrl: 'toc.component.html',
  styleUrl: 'toc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class TocComponent {
  readonly router = inject(Router);

  getIsActive(link: string) {
    return this.router.url.includes(link);
  }
}
