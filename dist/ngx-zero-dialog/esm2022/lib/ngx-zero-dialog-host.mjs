import { Directive, inject, ViewChild } from '@angular/core';
import { DialogContentDirective } from './dialog-content.directive';
import { DIALOG_CONFIG } from './providers/dialog-config.token';
import { DIALOG_REF } from './providers/dialog-ref.token';
import { HOST_DATA } from './providers/host-data.token';
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
export class NgxZeroDialogHost {
    /**
     * The insertion point for dynamic content within the dialog.
     * This is linked to the `DialogContentDirective` and is used for rendering
     * content such as templates or components into the dialog.
     *
     * @type {DialogContentDirective}
     */
    contentInsertionPoint;
    /**
     * A reference to the dialog, providing methods for controlling its lifecycle,
     * such as closing the dialog.
     *
     * @readonly
     * @type {DialogRef}
     */
    dialogRef = inject(DIALOG_REF);
    /**
     * The configuration object for the dialog, specifying properties such as
     * animations, backdrop behavior, and dialog-specific settings.
     *
     * @readonly
     * @type {IDialogConfig}
     */
    dialogConfig = inject(DIALOG_CONFIG);
    /**
     * The data specific to the host component, allowing customization of the host behavior
     * based on this data.
     *
     * @readonly
     * @type {HostData}
     */
    hostData = inject(HOST_DATA);
    constructor() {
        if (this.dialogConfig.closeOnBackdropClick) {
            this.#closeOnBackdropClick();
        }
    }
    /**
     * Closes the dialog when the user clicks outside its bounds (on the backdrop),
     * if the `closeOnBackdropClick` configuration is enabled.
     *
     * @private
     */
    #closeOnBackdropClick() {
        this.dialogRef.nativeDialog.addEventListener('click', (event) => {
            const rect = this.dialogRef.nativeDialog.getBoundingClientRect();
            const isInDialog = rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width;
            if (!isInDialog) {
                this.dialogRef.close();
            }
        }, { once: true });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: NgxZeroDialogHost, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.8", type: NgxZeroDialogHost, viewQueries: [{ propertyName: "contentInsertionPoint", first: true, predicate: DialogContentDirective, descendants: true, static: true }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: NgxZeroDialogHost, decorators: [{
            type: Directive
        }], ctorParameters: () => [], propDecorators: { contentInsertionPoint: [{
                type: ViewChild,
                args: [DialogContentDirective, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXplcm8tZGlhbG9nLWhvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtemVyby1kaWFsb2cvc3JjL2xpYi9uZ3gtemVyby1kaWFsb2ctaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDcEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBRXhEOzs7Ozs7OztHQVFHO0FBRUgsTUFBTSxPQUFPLGlCQUFpQjtJQUM1Qjs7Ozs7O09BTUc7SUFFSCxxQkFBcUIsQ0FBMEI7SUFFL0M7Ozs7OztPQU1HO0lBQ00sU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUV4Qzs7Ozs7O09BTUc7SUFDTSxZQUFZLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRTlDOzs7Ozs7T0FNRztJQUNNLFFBQVEsR0FBRyxNQUFNLENBQVcsU0FBUyxDQUFDLENBQUM7SUFFaEQ7UUFDRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUMzQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUMvQixDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gscUJBQXFCO1FBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUMxQyxPQUFPLEVBQ1AsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNSLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDakUsTUFBTSxVQUFVLEdBQ2QsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTztnQkFDekIsS0FBSyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNO2dCQUN2QyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPO2dCQUMxQixLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUUxQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekIsQ0FBQztRQUNILENBQUMsRUFDRCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FDZixDQUFDO0lBQ0osQ0FBQzt1R0FuRVUsaUJBQWlCOzJGQUFqQixpQkFBaUIsaUZBUWpCLHNCQUFzQjs7MkZBUnRCLGlCQUFpQjtrQkFEN0IsU0FBUzt3REFVUixxQkFBcUI7c0JBRHBCLFNBQVM7dUJBQUMsc0JBQXNCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBpbmplY3QsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEaWFsb2dDb250ZW50RGlyZWN0aXZlIH0gZnJvbSAnLi9kaWFsb2ctY29udGVudC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRElBTE9HX0NPTkZJRyB9IGZyb20gJy4vcHJvdmlkZXJzL2RpYWxvZy1jb25maWcudG9rZW4nO1xuaW1wb3J0IHsgRElBTE9HX1JFRiB9IGZyb20gJy4vcHJvdmlkZXJzL2RpYWxvZy1yZWYudG9rZW4nO1xuaW1wb3J0IHsgSE9TVF9EQVRBIH0gZnJvbSAnLi9wcm92aWRlcnMvaG9zdC1kYXRhLnRva2VuJztcblxuLyoqXG4gKiBBIGJhc2UgY2xhc3MgZm9yIGNyZWF0aW5nIGN1c3RvbSBkaWFsb2cgaG9zdCBjb21wb25lbnRzIGluIEFuZ3VsYXIuXG4gKiBQcm92aWRlcyB1dGlsaXRpZXMgZm9yIG1hbmFnaW5nIGRpYWxvZyBiZWhhdmlvciwgaW5qZWN0aW5nIGRpYWxvZy1zcGVjaWZpYyBkZXBlbmRlbmNpZXMsXG4gKiBhbmQgZW5hYmxpbmcgY3VzdG9tIGRpYWxvZyBjb250ZW50IGluc2VydGlvbi5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgTmd4WmVyb0RpYWxvZ0hvc3RcbiAqIEB0ZW1wbGF0ZSBIb3N0RGF0YSBUaGUgdHlwZSBvZiB0aGUgZGF0YSBwcm92aWRlZCB0byB0aGUgaG9zdCBjb21wb25lbnQuXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIE5neFplcm9EaWFsb2dIb3N0PEhvc3REYXRhPiB7XG4gIC8qKlxuICAgKiBUaGUgaW5zZXJ0aW9uIHBvaW50IGZvciBkeW5hbWljIGNvbnRlbnQgd2l0aGluIHRoZSBkaWFsb2cuXG4gICAqIFRoaXMgaXMgbGlua2VkIHRvIHRoZSBgRGlhbG9nQ29udGVudERpcmVjdGl2ZWAgYW5kIGlzIHVzZWQgZm9yIHJlbmRlcmluZ1xuICAgKiBjb250ZW50IHN1Y2ggYXMgdGVtcGxhdGVzIG9yIGNvbXBvbmVudHMgaW50byB0aGUgZGlhbG9nLlxuICAgKlxuICAgKiBAdHlwZSB7RGlhbG9nQ29udGVudERpcmVjdGl2ZX1cbiAgICovXG4gIEBWaWV3Q2hpbGQoRGlhbG9nQ29udGVudERpcmVjdGl2ZSwgeyBzdGF0aWM6IHRydWUgfSlcbiAgY29udGVudEluc2VydGlvblBvaW50ITogRGlhbG9nQ29udGVudERpcmVjdGl2ZTtcblxuICAvKipcbiAgICogQSByZWZlcmVuY2UgdG8gdGhlIGRpYWxvZywgcHJvdmlkaW5nIG1ldGhvZHMgZm9yIGNvbnRyb2xsaW5nIGl0cyBsaWZlY3ljbGUsXG4gICAqIHN1Y2ggYXMgY2xvc2luZyB0aGUgZGlhbG9nLlxuICAgKlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge0RpYWxvZ1JlZn1cbiAgICovXG4gIHJlYWRvbmx5IGRpYWxvZ1JlZiA9IGluamVjdChESUFMT0dfUkVGKTtcblxuICAvKipcbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciB0aGUgZGlhbG9nLCBzcGVjaWZ5aW5nIHByb3BlcnRpZXMgc3VjaCBhc1xuICAgKiBhbmltYXRpb25zLCBiYWNrZHJvcCBiZWhhdmlvciwgYW5kIGRpYWxvZy1zcGVjaWZpYyBzZXR0aW5ncy5cbiAgICpcbiAgICogQHJlYWRvbmx5XG4gICAqIEB0eXBlIHtJRGlhbG9nQ29uZmlnfVxuICAgKi9cbiAgcmVhZG9ubHkgZGlhbG9nQ29uZmlnID0gaW5qZWN0KERJQUxPR19DT05GSUcpO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF0YSBzcGVjaWZpYyB0byB0aGUgaG9zdCBjb21wb25lbnQsIGFsbG93aW5nIGN1c3RvbWl6YXRpb24gb2YgdGhlIGhvc3QgYmVoYXZpb3JcbiAgICogYmFzZWQgb24gdGhpcyBkYXRhLlxuICAgKlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge0hvc3REYXRhfVxuICAgKi9cbiAgcmVhZG9ubHkgaG9zdERhdGEgPSBpbmplY3Q8SG9zdERhdGE+KEhPU1RfREFUQSk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHRoaXMuZGlhbG9nQ29uZmlnLmNsb3NlT25CYWNrZHJvcENsaWNrKSB7XG4gICAgICB0aGlzLiNjbG9zZU9uQmFja2Ryb3BDbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGRpYWxvZyB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvdXRzaWRlIGl0cyBib3VuZHMgKG9uIHRoZSBiYWNrZHJvcCksXG4gICAqIGlmIHRoZSBgY2xvc2VPbkJhY2tkcm9wQ2xpY2tgIGNvbmZpZ3VyYXRpb24gaXMgZW5hYmxlZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gICNjbG9zZU9uQmFja2Ryb3BDbGljaygpIHtcbiAgICB0aGlzLmRpYWxvZ1JlZi5uYXRpdmVEaWFsb2cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdjbGljaycsXG4gICAgICAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZGlhbG9nUmVmLm5hdGl2ZURpYWxvZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgaXNJbkRpYWxvZyA9XG4gICAgICAgICAgcmVjdC50b3AgPD0gZXZlbnQuY2xpZW50WSAmJlxuICAgICAgICAgIGV2ZW50LmNsaWVudFkgPD0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAmJlxuICAgICAgICAgIHJlY3QubGVmdCA8PSBldmVudC5jbGllbnRYICYmXG4gICAgICAgICAgZXZlbnQuY2xpZW50WCA8PSByZWN0LmxlZnQgKyByZWN0LndpZHRoO1xuXG4gICAgICAgIGlmICghaXNJbkRpYWxvZykge1xuICAgICAgICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7IG9uY2U6IHRydWUgfVxuICAgICk7XG4gIH1cbn1cbiJdfQ==