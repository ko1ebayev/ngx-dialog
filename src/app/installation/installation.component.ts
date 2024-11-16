import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
export class InstallationComponent implements OnInit {
  readonly installCode = `
    yarn add ngx-zero-dialog
  `;

  readonly providerCode = `
    import { provideNgxDialog } from 'ngx-zero-dialog';

    providers: [ provideNgxDialog({ hostID: 'ngx-dialog-container' }) ]
  `;

  readonly containerCode = `
    <div id="ngx-dialog-container"></div>
  `;

  readonly importStylesCode = `
    @import 'node_modules/ngx-zero-dialog/styles/ngx-zero-dialog.scss';
  `;

  constructor() {}

  ngOnInit() {}
}
