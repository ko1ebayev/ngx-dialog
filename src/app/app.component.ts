import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ComponentExampleComponent } from './component-example/component-example.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { InstallationComponent } from './installation/installation.component';
import { OverviewComponent } from './overview/overview.component';
import { TemplateExampleComponent } from './template-example/template-example.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    InstallationComponent,
    FooterComponent,
    OverviewComponent,
    ComponentExampleComponent,
    TemplateExampleComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
