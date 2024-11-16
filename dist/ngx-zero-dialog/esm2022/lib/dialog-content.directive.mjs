import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * A structural directive that marks an insertion point for dynamic dialog content.
 * It provides access to a `ViewContainerRef`, which can be used to dynamically
 * insert templates or components into the dialog.
 *
 * @export
 * @class DialogContentDirective
 */
export class DialogContentDirective {
    viewContainerRef;
    constructor(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: DialogContentDirective, deps: [{ token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.8", type: DialogContentDirective, isStandalone: true, selector: "[dialogContent]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: DialogContentDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[dialogContent]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbnRlbnQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXplcm8tZGlhbG9nL3NyYy9saWIvZGlhbG9nLWNvbnRlbnQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQW9CLE1BQU0sZUFBZSxDQUFDOztBQUU1RDs7Ozs7OztHQU9HO0FBRUgsTUFBTSxPQUFPLHNCQUFzQjtJQUNaO0lBQXJCLFlBQXFCLGdCQUFrQztRQUFsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO0lBQUcsQ0FBQzt1R0FEaEQsc0JBQXNCOzJGQUF0QixzQkFBc0I7OzJGQUF0QixzQkFBc0I7a0JBRGxDLFNBQVM7bUJBQUMsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEEgc3RydWN0dXJhbCBkaXJlY3RpdmUgdGhhdCBtYXJrcyBhbiBpbnNlcnRpb24gcG9pbnQgZm9yIGR5bmFtaWMgZGlhbG9nIGNvbnRlbnQuXG4gKiBJdCBwcm92aWRlcyBhY2Nlc3MgdG8gYSBgVmlld0NvbnRhaW5lclJlZmAsIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGR5bmFtaWNhbGx5XG4gKiBpbnNlcnQgdGVtcGxhdGVzIG9yIGNvbXBvbmVudHMgaW50byB0aGUgZGlhbG9nLlxuICpcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBEaWFsb2dDb250ZW50RGlyZWN0aXZlXG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tkaWFsb2dDb250ZW50XScsIHN0YW5kYWxvbmU6IHRydWUgfSlcbmV4cG9ydCBjbGFzcyBEaWFsb2dDb250ZW50RGlyZWN0aXZlIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge31cbn1cbiJdfQ==