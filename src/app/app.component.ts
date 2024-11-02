import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ExamplesComponent } from "./examples/examples.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { InstallationComponent } from "./installation/installation.component";
import { OverviewComponent } from "./overview/overview.component";
import { TocComponent } from "./toc/toc.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    InstallationComponent,
    FooterComponent,
    OverviewComponent,
    ExamplesComponent,
    TocComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
}
