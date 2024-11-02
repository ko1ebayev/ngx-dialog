import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentModalsExampleComponent } from "./component-modals-example/component-modals-example.component";
import { DialogConfigExampleComponent } from "./dialog-config-example/dialog-config-example.component";
import { DialogDataExampleComponent } from './dialog-data-example/dialog-data-example.component';
import { HostComponentExampleComponent } from "./host-component-example/host-component-example.component";
import { TemplateModalsExampleComponent } from "./template-modals-example/template-modals-example.component";

@Component({
    standalone: true,
    selector: 'app-examples',
    templateUrl: 'examples.component.html',
    imports: [CommonModule, ComponentModalsExampleComponent, TemplateModalsExampleComponent, DialogConfigExampleComponent, DialogDataExampleComponent, HostComponentExampleComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ExamplesComponent {
}