import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';
import { BehaviorSubject, interval } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-code-snippet',
  templateUrl: 'code-snippet.component.html',
  styleUrl: 'code-snippet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, Highlight],
})
export class CodeSnippetComponent {
  readonly code = input.required<string>();
  readonly language = input.required<
    'html' | 'javascript' | 'typescript' | 'css'
  >();
  readonly showCopied = new BehaviorSubject(false);

  copy() {
    navigator.clipboard.writeText(this.code());
    this.showCopied.next(true);
    interval(1300).subscribe(() => {
      this.showCopied.next(false);
    });
  }
}
