/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[ngxDialogContent]', standalone: true })
export class NgxDialogContentDirective {
  constructor(readonly viewContainerRef: ViewContainerRef) {}
}
