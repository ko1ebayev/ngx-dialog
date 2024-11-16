import { Directive, ViewContainerRef } from '@angular/core';

/**
 * A structural directive that marks an insertion point for dynamic dialog content.
 * It provides access to a `ViewContainerRef`, which can be used to dynamically
 * insert templates or components into the dialog.
 *
 * @export
 * @class DialogContentDirective
 */
@Directive({ selector: '[dialogContent]', standalone: true })
export class DialogContentDirective {
  constructor(readonly viewContainerRef: ViewContainerRef) {}
}
