import { ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * A structural directive that marks an insertion point for dynamic dialog content.
 * It provides access to a `ViewContainerRef`, which can be used to dynamically
 * insert templates or components into the dialog.
 *
 * @export
 * @class DialogContentDirective
 */
export declare class DialogContentDirective {
    readonly viewContainerRef: ViewContainerRef;
    constructor(viewContainerRef: ViewContainerRef);
    static ɵfac: i0.ɵɵFactoryDeclaration<DialogContentDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DialogContentDirective, "[dialogContent]", never, {}, {}, never, never, true, never>;
}
