import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { CodeSnippetComponent } from '../components/code-snippet/code-snippet.component';

@Component({
  standalone: true,
  selector: 'app-installation',
  templateUrl: 'installation.component.html',
  styleUrl: 'installation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTabsModule, CodeSnippetComponent],
})
export class InstallationComponent {
  readonly installCode = `
    yarn add ngx-zero-dialog
  `;

  readonly providerCode = `
    import { provideNgxDialog } from 'ngx-zero-dialog';

    providers: [ provideNgxDialog({ containerNodeID: 'ngx-zero-dialog-container' }) ]
  `;

  readonly containerCode = `
    <div id="ngx-zero-dialog-container"></div>
  `;

  readonly importStylesCode = `
    assets: [
      "node_modules/ngx-zero-dialog/styles/ngx-zero-dialog.scss",
    ]
  `;
}
