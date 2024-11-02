/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[dialogContent]', standalone: true })
export class DialogContentDirective {
  constructor(readonly viewContainerRef: ViewContainerRef) {}
}
