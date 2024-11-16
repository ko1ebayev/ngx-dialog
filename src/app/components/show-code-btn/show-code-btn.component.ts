import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-show-code-btn',
  templateUrl: 'show-code-btn.component.html',
  styleUrl: 'show-code-btn.component.scss',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowCodeBtnComponent {
  @HostBinding('attr.data-active')
  @Input()
  active = false;
}
