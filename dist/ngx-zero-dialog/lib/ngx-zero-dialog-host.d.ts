import { DialogContentDirective } from './dialog-content.directive';
import * as i0 from "@angular/core";
/**
 * A base class for creating custom dialog host components in Angular.
 * Provides utilities for managing dialog behavior, injecting dialog-specific dependencies,
 * and enabling custom dialog content insertion.
 *
 * @export
 * @class NgxZeroDialogHost
 * @template HostData The type of the data provided to the host component.
 */
export declare class NgxZeroDialogHost<HostData> {
    #private;
    /**
     * The insertion point for dynamic content within the dialog.
     * This is linked to the `DialogContentDirective` and is used for rendering
     * content such as templates or components into the dialog.
     *
     * @type {DialogContentDirective}
     */
    contentInsertionPoint: DialogContentDirective;
    /**
     * A reference to the dialog, providing methods for controlling its lifecycle,
     * such as closing the dialog.
     *
     * @readonly
     * @type {DialogRef}
     */
    readonly dialogRef: import("./dialog-ref").DialogRef<unknown>;
    /**
     * The configuration object for the dialog, specifying properties such as
     * animations, backdrop behavior, and dialog-specific settings.
     *
     * @readonly
     * @type {IDialogConfig}
     */
    readonly dialogConfig: import("ngx-zero-dialog").IDialogConfig;
    /**
     * The data specific to the host component, allowing customization of the host behavior
     * based on this data.
     *
     * @readonly
     * @type {HostData}
     */
    readonly hostData: HostData;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxZeroDialogHost<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxZeroDialogHost<any>, never, never, {}, {}, never, never, false, never>;
}
