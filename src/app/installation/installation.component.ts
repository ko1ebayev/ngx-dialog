import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CodeSnippetComponent } from '../code-snippet/code-snippet.component';

@Component({
    standalone: true,
    selector: 'app-installation',
    templateUrl: 'installation.component.html',
    styleUrl: 'installation.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MatTabsModule, CodeSnippetComponent]
})
export class InstallationComponent implements OnInit {
    readonly installCode = `
        yarn add ngx-zero-dialog // or use your package manager
    `

    readonly providerCode = `
        export const appConfig: ApplicationConfig = {
            providers: [
                provideZoneChangeDetection({ eventCoalescing: true }),
                provideRouter(routes),
                // ...other providers
                provideNgxDialog({ hostID: 'ngx-dialog-host' }),
            ],
        };
    `;

    readonly containerCode = `
        @Component({
            selector: 'app-root',
            standalone: true,
            template: \`<div id="ngx-dialog-container"></div>\`,
            styleUrl: './app.component.scss',
            imports: [
                CommonModule,
            ],
        })
        export class AppComponent { }
    `;

    constructor() { }

    ngOnInit() { }
}