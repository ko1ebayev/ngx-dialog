import { DOCUMENT } from '@angular/common';
import { ApplicationRef, createComponent, inject, Injectable, Injector, TemplateRef, } from '@angular/core';
import { defer, finalize, take } from 'rxjs';
import { DialogRef } from './dialog-ref';
import { DIALOG_CONFIG } from './providers/dialog-config.token';
import { DIALOG_DATA } from './providers/dialog-data.token';
import { DIALOG_REF } from './providers/dialog-ref.token';
import { HOST_DATA } from './providers/host-data.token';
import { NGX_ZERO_DIALOG_CONFIG } from './providers/provide-ngx-zero-dialog';
import * as i0 from "@angular/core";
/**
 * NgxZeroDialogService managing dialog creation, configuration, and lifecycle in Angular.
 * It supports opening dialogs with components or templates, injecting dependencies,
 * and handling cleanup after dialog closure.
 *
 * @export
 * @class NgxZeroDialogService
 */
export class NgxZeroDialogService {
    ngxZeroDialogConfig = inject(NGX_ZERO_DIALOG_CONFIG);
    parentInjector = inject(Injector);
    appRef = inject(ApplicationRef);
    document = inject(DOCUMENT);
    /**
     * Opens a dialog with the specified template or component.
     * The dialog configuration allows customization of behavior, data, and animations.
     *
     * @template Result The type of result the dialog will return.
     * @param {Component | TemplateRef<any>} templateOrComponent The component or template to render in the dialog.
     * @param {IDialogConfig} [config] Optional dialog configuration.
     * @returns {Observable<DialogResult<Result>>} Observable emitting the result of the dialog on closure.
     */
    openDialog(templateOrComponent, config) {
        return defer(() => {
            const normalizedConfig = this.normalizeConfig(config);
            const dialogRef = this.createDialogRef(normalizedConfig);
            const dialogInjector = this.createDialogInjector(this.parentInjector, dialogRef, normalizedConfig.dialogData);
            const hostInjector = this.createHostInjector(this.parentInjector, normalizedConfig.hostData, normalizedConfig, dialogRef);
            const hostComponentRef = createComponent(normalizedConfig.hostComponent, {
                environmentInjector: this.appRef.injector,
                elementInjector: hostInjector,
            });
            this.appRef.attachView(hostComponentRef.hostView);
            this.document
                .getElementById(this.ngxZeroDialogConfig.containerNodeID)
                .appendChild(dialogRef.nativeDialog);
            dialogRef.nativeDialog.appendChild(this.getComponentRootNode(hostComponentRef));
            let viewRef;
            if (templateOrComponent instanceof TemplateRef) {
                viewRef =
                    hostComponentRef.instance.contentInsertionPoint.viewContainerRef.createEmbeddedView(templateOrComponent, {
                        $implicit: dialogRef,
                        data: normalizedConfig.dialogData,
                        injector: dialogInjector,
                    });
            }
            else {
                viewRef =
                    hostComponentRef.instance.contentInsertionPoint.viewContainerRef.createComponent(templateOrComponent, { injector: dialogInjector });
            }
            dialogRef.nativeDialog.showModal();
            if (normalizedConfig.animated) {
                dialogRef.nativeDialog.classList.add('ngx-zero-dialog-visible');
            }
            return dialogRef.closed$.pipe(take(1), finalize(() => {
                this.cleanupDialog(dialogRef.nativeDialog.id, hostComponentRef, viewRef);
            }));
        });
    }
    /**
     * Creates a new dialog reference, including DOM element creation and configuration.
     *
     * @template Result The type of result the dialog will return.
     * @param {IDialogConfig} config The configuration for the dialog.
     * @returns {DialogRef<Result>} The dialog reference object.
     */
    createDialogRef(config) {
        const newDialog = document.createElement('dialog');
        const dialogID = `dialog-${Date.now()}`;
        newDialog.setAttribute('aria-modal', 'true');
        newDialog.setAttribute('role', 'dialog');
        newDialog.setAttribute('id', dialogID);
        newDialog.classList.add('ngx-zero-dialog');
        if (config.dialogNodeClass) {
            newDialog.classList.add(config.dialogNodeClass);
        }
        if (config.animated) {
            newDialog.classList.add('ngx-zero-dialog-hidden');
        }
        else {
            newDialog.classList.add('ngx-zero-dialog-visible');
        }
        const dialogRef = new DialogRef(newDialog, config.animated);
        return dialogRef;
    }
    /**
     * Cleans up the dialog after it is closed, including removing it from the DOM and destroying views.
     *
     * @param {string} dialogID The ID of the dialog element to remove.
     * @param {ComponentRef<any>} dialogHostRef The reference to the host component.
     * @param {EmbeddedViewRef<any>} viewRef The reference to the embedded view.
     */
    cleanupDialog(dialogID, dialogHostRef, viewRef) {
        viewRef.destroy();
        dialogHostRef.hostView.destroy();
        dialogHostRef.destroy();
        this.document
            .getElementById(this.ngxZeroDialogConfig.containerNodeID)
            .removeChild(this.document.getElementById(dialogID));
    }
    /**
     * Retrieves the root DOM node of a dynamically created component.
     *
     * @param {ComponentRef<any>} componentRef The reference to the dynamically created component.
     * @returns {HTMLElement} The root DOM node of the component.
     */
    getComponentRootNode(componentRef) {
        return componentRef.hostView
            .rootNodes[0];
    }
    /**
     * Normalizes the dialog configuration by merging defaults with provided options.
     *
     * @param {IDialogConfig} [config] The provided dialog configuration.
     * @returns {WithRequiredProperties<IDialogConfig>} The normalized dialog configuration.
     */
    normalizeConfig(config) {
        return {
            closeOnBackdropClick: config?.closeOnBackdropClick ?? true,
            dialogData: config?.dialogData ?? {},
            hostComponent: config?.hostComponent,
            animated: this.ngxZeroDialogConfig.enableAnimations ?? config?.animated ?? true,
            hostData: config?.hostData ?? {},
        };
    }
    /**
     * Creates a custom injector for injecting dialog-specific dependencies into the dialog component or template.
     *
     * @param {Injector} parentInjector The parent injector.
     * @param {DialogRef} dialogRef The dialog reference.
     * @param {IDialogData} data The data to inject into the dialog.
     * @returns {Injector} The created custom injector.
     */
    createDialogInjector(parentInjector, dialogRef, data) {
        return Injector.create({
            parent: parentInjector,
            providers: [
                {
                    provide: DIALOG_REF,
                    useValue: dialogRef,
                },
                {
                    provide: DIALOG_DATA,
                    useValue: data,
                },
            ],
        });
    }
    /**
     * Creates a custom injector for injecting host-specific dependencies into the host component.
     *
     * @param {Injector} parentInjector The parent injector.
     * @param {IHostData} hostData The data specific to the host component.
     * @param {IDialogConfig} dialogConfig The dialog configuration.
     * @param {DialogRef} dialogRef The dialog reference.
     * @returns {Injector} The created custom injector.
     */
    createHostInjector(parentInjector, hostData, dialogConfig, dialogRef) {
        return Injector.create({
            parent: parentInjector,
            providers: [
                {
                    provide: HOST_DATA,
                    useValue: hostData,
                },
                {
                    provide: DIALOG_CONFIG,
                    useValue: dialogConfig,
                },
                {
                    provide: DIALOG_REF,
                    useValue: dialogRef,
                },
            ],
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: NgxZeroDialogService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: NgxZeroDialogService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: NgxZeroDialogService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXplcm8tZGlhbG9nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtemVyby1kaWFsb2cvc3JjL2xpYi9uZ3gtemVyby1kaWFsb2cuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUNMLGNBQWMsRUFFZCxlQUFlLEVBRWYsTUFBTSxFQUNOLFVBQVUsRUFDVixRQUFRLEVBQ1IsV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFjLElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUV6RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBUXpDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNoRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzFELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQzs7QUFFN0U7Ozs7Ozs7R0FPRztBQUVILE1BQU0sT0FBTyxvQkFBb0I7SUFDZCxtQkFBbUIsR0FBRyxNQUFNLENBQzNDLHNCQUFzQixDQUN2QixDQUFDO0lBRWUsY0FBYyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVsQyxNQUFNLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRWhDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFN0M7Ozs7Ozs7O09BUUc7SUFDSCxVQUFVLENBQ1IsbUJBQWlELEVBQ2pELE1BQXNCO1FBRXRCLE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNoQixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBUyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRWpFLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FDOUMsSUFBSSxDQUFDLGNBQWMsRUFDQyxTQUFTLEVBQzdCLGdCQUFnQixDQUFDLFVBQVUsQ0FDNUIsQ0FBQztZQUVGLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FDMUMsSUFBSSxDQUFDLGNBQWMsRUFDbkIsZ0JBQWdCLENBQUMsUUFBUSxFQUN6QixnQkFBZ0IsRUFDSSxTQUFTLENBQzlCLENBQUM7WUFFRixNQUFNLGdCQUFnQixHQUFHLGVBQWUsQ0FDdEMsZ0JBQWdCLENBQUMsYUFBYSxFQUM5QjtnQkFDRSxtQkFBbUIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7Z0JBQ3pDLGVBQWUsRUFBRSxZQUFZO2FBQzlCLENBQ0YsQ0FBQztZQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWxELElBQUksQ0FBQyxRQUFRO2lCQUNWLGNBQWMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFFO2lCQUN6RCxXQUFXLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXZDLFNBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUNoQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLENBQUMsQ0FDNUMsQ0FBQztZQUVGLElBQUksT0FBNkIsQ0FBQztZQUVsQyxJQUFJLG1CQUFtQixZQUFZLFdBQVcsRUFBRSxDQUFDO2dCQUMvQyxPQUFPO29CQUNMLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FDakYsbUJBQW1CLEVBQ25CO3dCQUNFLFNBQVMsRUFBRSxTQUFTO3dCQUNwQixJQUFJLEVBQUUsZ0JBQWdCLENBQUMsVUFBVTt3QkFDakMsUUFBUSxFQUFFLGNBQWM7cUJBQ3pCLENBQ0YsQ0FBQztZQUNOLENBQUM7aUJBQU0sQ0FBQztnQkFDTixPQUFPO29CQUNMLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQzlFLG1CQUFtQixFQUNuQixFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsQ0FDN0IsQ0FBQztZQUNOLENBQUM7WUFFRCxTQUFTLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRW5DLElBQUksZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzlCLFNBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ2xFLENBQUM7WUFFRCxPQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ1AsUUFBUSxDQUFDLEdBQUcsRUFBRTtnQkFDWixJQUFJLENBQUMsYUFBYSxDQUNoQixTQUFTLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFDekIsZ0JBQWdCLEVBQ2hCLE9BQU8sQ0FDUixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNLLGVBQWUsQ0FBUyxNQUFxQjtRQUNuRCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFVBQVUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7UUFFeEMsU0FBUyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0MsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDekMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdkMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUUzQyxJQUFJLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUMzQixTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUVELElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3BCLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDcEQsQ0FBQzthQUFNLENBQUM7WUFDTixTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBUyxTQUFTLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXBFLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSyxhQUFhLENBQ25CLFFBQWdCLEVBQ2hCLGFBQWdDLEVBQ2hDLE9BQTZCO1FBRTdCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVsQixhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV4QixJQUFJLENBQUMsUUFBUTthQUNWLGNBQWMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFFO2FBQ3pELFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNLLG9CQUFvQixDQUFDLFlBQStCO1FBQzFELE9BQVEsWUFBWSxDQUFDLFFBQWlDO2FBQ25ELFNBQVMsQ0FBQyxDQUFDLENBQWdCLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssZUFBZSxDQUNyQixNQUFzQjtRQUV0QixPQUFPO1lBQ0wsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLG9CQUFvQixJQUFJLElBQUk7WUFDMUQsVUFBVSxFQUFFLE1BQU0sRUFBRSxVQUFVLElBQUksRUFBRTtZQUNwQyxhQUFhLEVBQUUsTUFBTSxFQUFFLGFBQWE7WUFDcEMsUUFBUSxFQUNOLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsSUFBSSxNQUFNLEVBQUUsUUFBUSxJQUFJLElBQUk7WUFDdkUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLElBQUksRUFBRTtTQUNRLENBQUM7SUFDN0MsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSyxvQkFBb0IsQ0FDMUIsY0FBd0IsRUFDeEIsU0FBb0IsRUFDcEIsSUFBaUI7UUFFakIsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3JCLE1BQU0sRUFBRSxjQUFjO1lBQ3RCLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxPQUFPLEVBQUUsVUFBVTtvQkFDbkIsUUFBUSxFQUFFLFNBQVM7aUJBQ3BCO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxXQUFXO29CQUNwQixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ssa0JBQWtCLENBQ3hCLGNBQXdCLEVBQ3hCLFFBQW1CLEVBQ25CLFlBQTJCLEVBQzNCLFNBQW9CO1FBRXBCLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNyQixNQUFNLEVBQUUsY0FBYztZQUN0QixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLFNBQVM7b0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2lCQUNuQjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsYUFBYTtvQkFDdEIsUUFBUSxFQUFFLFlBQVk7aUJBQ3ZCO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxVQUFVO29CQUNuQixRQUFRLEVBQUUsU0FBUztpQkFDcEI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7dUdBblBVLG9CQUFvQjsyR0FBcEIsb0JBQW9CLGNBRFAsTUFBTTs7MkZBQ25CLG9CQUFvQjtrQkFEaEMsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBcHBsaWNhdGlvblJlZixcbiAgQ29tcG9uZW50UmVmLFxuICBjcmVhdGVDb21wb25lbnQsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgaW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3RvcixcbiAgVGVtcGxhdGVSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZGVmZXIsIGZpbmFsaXplLCBPYnNlcnZhYmxlLCB0YWtlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IERpYWxvZ1JlZiB9IGZyb20gJy4vZGlhbG9nLXJlZic7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL21vZGVscy9jb21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IElEaWFsb2dDb25maWcgfSBmcm9tICcuL21vZGVscy9kaWFsb2ctY29uZmlnLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJRGlhbG9nRGF0YSB9IGZyb20gJy4vbW9kZWxzL2RpYWxvZy1kYXRhLmludGVyZmFjZSc7XG5pbXBvcnQgeyBEaWFsb2dSZXN1bHQgfSBmcm9tICcuL21vZGVscy9kaWFsb2ctcmVzdWx0LnR5cGUnO1xuaW1wb3J0IHsgSUhvc3REYXRhIH0gZnJvbSAnLi9tb2RlbHMvaG9zdC1kYXRhLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJTmd4WmVyb0RpYWxvZ0NvbmZpZyB9IGZyb20gJy4vbW9kZWxzL25neC16ZXJvLWRpYWxvZy1jb25maWcuaW50ZXJmYWNlJztcbmltcG9ydCB7IFdpdGhSZXF1aXJlZFByb3BlcnRpZXMgfSBmcm9tICcuL21vZGVscy93aXRoLXJlcXVpcmVkLXByb3BlcnRpZXMudHlwZSc7XG5pbXBvcnQgeyBESUFMT0dfQ09ORklHIH0gZnJvbSAnLi9wcm92aWRlcnMvZGlhbG9nLWNvbmZpZy50b2tlbic7XG5pbXBvcnQgeyBESUFMT0dfREFUQSB9IGZyb20gJy4vcHJvdmlkZXJzL2RpYWxvZy1kYXRhLnRva2VuJztcbmltcG9ydCB7IERJQUxPR19SRUYgfSBmcm9tICcuL3Byb3ZpZGVycy9kaWFsb2ctcmVmLnRva2VuJztcbmltcG9ydCB7IEhPU1RfREFUQSB9IGZyb20gJy4vcHJvdmlkZXJzL2hvc3QtZGF0YS50b2tlbic7XG5pbXBvcnQgeyBOR1hfWkVST19ESUFMT0dfQ09ORklHIH0gZnJvbSAnLi9wcm92aWRlcnMvcHJvdmlkZS1uZ3gtemVyby1kaWFsb2cnO1xuXG4vKipcbiAqIE5neFplcm9EaWFsb2dTZXJ2aWNlIG1hbmFnaW5nIGRpYWxvZyBjcmVhdGlvbiwgY29uZmlndXJhdGlvbiwgYW5kIGxpZmVjeWNsZSBpbiBBbmd1bGFyLlxuICogSXQgc3VwcG9ydHMgb3BlbmluZyBkaWFsb2dzIHdpdGggY29tcG9uZW50cyBvciB0ZW1wbGF0ZXMsIGluamVjdGluZyBkZXBlbmRlbmNpZXMsXG4gKiBhbmQgaGFuZGxpbmcgY2xlYW51cCBhZnRlciBkaWFsb2cgY2xvc3VyZS5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgTmd4WmVyb0RpYWxvZ1NlcnZpY2VcbiAqL1xuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBOZ3haZXJvRGlhbG9nU2VydmljZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbmd4WmVyb0RpYWxvZ0NvbmZpZyA9IGluamVjdDxJTmd4WmVyb0RpYWxvZ0NvbmZpZz4oXG4gICAgTkdYX1pFUk9fRElBTE9HX0NPTkZJR1xuICApO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgcGFyZW50SW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYXBwUmVmID0gaW5qZWN0KEFwcGxpY2F0aW9uUmVmKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IGRvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcblxuICAvKipcbiAgICogT3BlbnMgYSBkaWFsb2cgd2l0aCB0aGUgc3BlY2lmaWVkIHRlbXBsYXRlIG9yIGNvbXBvbmVudC5cbiAgICogVGhlIGRpYWxvZyBjb25maWd1cmF0aW9uIGFsbG93cyBjdXN0b21pemF0aW9uIG9mIGJlaGF2aW9yLCBkYXRhLCBhbmQgYW5pbWF0aW9ucy5cbiAgICpcbiAgICogQHRlbXBsYXRlIFJlc3VsdCBUaGUgdHlwZSBvZiByZXN1bHQgdGhlIGRpYWxvZyB3aWxsIHJldHVybi5cbiAgICogQHBhcmFtIHtDb21wb25lbnQgfCBUZW1wbGF0ZVJlZjxhbnk+fSB0ZW1wbGF0ZU9yQ29tcG9uZW50IFRoZSBjb21wb25lbnQgb3IgdGVtcGxhdGUgdG8gcmVuZGVyIGluIHRoZSBkaWFsb2cuXG4gICAqIEBwYXJhbSB7SURpYWxvZ0NvbmZpZ30gW2NvbmZpZ10gT3B0aW9uYWwgZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPERpYWxvZ1Jlc3VsdDxSZXN1bHQ+Pn0gT2JzZXJ2YWJsZSBlbWl0dGluZyB0aGUgcmVzdWx0IG9mIHRoZSBkaWFsb2cgb24gY2xvc3VyZS5cbiAgICovXG4gIG9wZW5EaWFsb2c8UmVzdWx0PihcbiAgICB0ZW1wbGF0ZU9yQ29tcG9uZW50OiBDb21wb25lbnQgfCBUZW1wbGF0ZVJlZjxhbnk+LFxuICAgIGNvbmZpZz86IElEaWFsb2dDb25maWdcbiAgKTogT2JzZXJ2YWJsZTxEaWFsb2dSZXN1bHQ8UmVzdWx0Pj4ge1xuICAgIHJldHVybiBkZWZlcigoKSA9PiB7XG4gICAgICBjb25zdCBub3JtYWxpemVkQ29uZmlnID0gdGhpcy5ub3JtYWxpemVDb25maWcoY29uZmlnKTtcblxuICAgICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5jcmVhdGVEaWFsb2dSZWY8UmVzdWx0Pihub3JtYWxpemVkQ29uZmlnKTtcblxuICAgICAgY29uc3QgZGlhbG9nSW5qZWN0b3IgPSB0aGlzLmNyZWF0ZURpYWxvZ0luamVjdG9yKFxuICAgICAgICB0aGlzLnBhcmVudEluamVjdG9yLFxuICAgICAgICA8RGlhbG9nUmVmPHVua25vd24+PmRpYWxvZ1JlZixcbiAgICAgICAgbm9ybWFsaXplZENvbmZpZy5kaWFsb2dEYXRhXG4gICAgICApO1xuXG4gICAgICBjb25zdCBob3N0SW5qZWN0b3IgPSB0aGlzLmNyZWF0ZUhvc3RJbmplY3RvcihcbiAgICAgICAgdGhpcy5wYXJlbnRJbmplY3RvcixcbiAgICAgICAgbm9ybWFsaXplZENvbmZpZy5ob3N0RGF0YSxcbiAgICAgICAgbm9ybWFsaXplZENvbmZpZyxcbiAgICAgICAgPERpYWxvZ1JlZjx1bmtub3duPj5kaWFsb2dSZWZcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGhvc3RDb21wb25lbnRSZWYgPSBjcmVhdGVDb21wb25lbnQ8YW55PihcbiAgICAgICAgbm9ybWFsaXplZENvbmZpZy5ob3N0Q29tcG9uZW50LFxuICAgICAgICB7XG4gICAgICAgICAgZW52aXJvbm1lbnRJbmplY3RvcjogdGhpcy5hcHBSZWYuaW5qZWN0b3IsXG4gICAgICAgICAgZWxlbWVudEluamVjdG9yOiBob3N0SW5qZWN0b3IsXG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIHRoaXMuYXBwUmVmLmF0dGFjaFZpZXcoaG9zdENvbXBvbmVudFJlZi5ob3N0Vmlldyk7XG5cbiAgICAgIHRoaXMuZG9jdW1lbnRcbiAgICAgICAgLmdldEVsZW1lbnRCeUlkKHRoaXMubmd4WmVyb0RpYWxvZ0NvbmZpZy5jb250YWluZXJOb2RlSUQpIVxuICAgICAgICAuYXBwZW5kQ2hpbGQoZGlhbG9nUmVmLm5hdGl2ZURpYWxvZyk7XG5cbiAgICAgIGRpYWxvZ1JlZi5uYXRpdmVEaWFsb2cuYXBwZW5kQ2hpbGQoXG4gICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50Um9vdE5vZGUoaG9zdENvbXBvbmVudFJlZilcbiAgICAgICk7XG5cbiAgICAgIGxldCB2aWV3UmVmOiBFbWJlZGRlZFZpZXdSZWY8YW55PjtcblxuICAgICAgaWYgKHRlbXBsYXRlT3JDb21wb25lbnQgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgICB2aWV3UmVmID1cbiAgICAgICAgICBob3N0Q29tcG9uZW50UmVmLmluc3RhbmNlLmNvbnRlbnRJbnNlcnRpb25Qb2ludC52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyhcbiAgICAgICAgICAgIHRlbXBsYXRlT3JDb21wb25lbnQsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICRpbXBsaWNpdDogZGlhbG9nUmVmLFxuICAgICAgICAgICAgICBkYXRhOiBub3JtYWxpemVkQ29uZmlnLmRpYWxvZ0RhdGEsXG4gICAgICAgICAgICAgIGluamVjdG9yOiBkaWFsb2dJbmplY3RvcixcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlld1JlZiA9XG4gICAgICAgICAgaG9zdENvbXBvbmVudFJlZi5pbnN0YW5jZS5jb250ZW50SW5zZXJ0aW9uUG9pbnQudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoXG4gICAgICAgICAgICB0ZW1wbGF0ZU9yQ29tcG9uZW50LFxuICAgICAgICAgICAgeyBpbmplY3RvcjogZGlhbG9nSW5qZWN0b3IgfVxuICAgICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGRpYWxvZ1JlZi5uYXRpdmVEaWFsb2cuc2hvd01vZGFsKCk7XG5cbiAgICAgIGlmIChub3JtYWxpemVkQ29uZmlnLmFuaW1hdGVkKSB7XG4gICAgICAgIGRpYWxvZ1JlZi5uYXRpdmVEaWFsb2cuY2xhc3NMaXN0LmFkZCgnbmd4LXplcm8tZGlhbG9nLXZpc2libGUnKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRpYWxvZ1JlZi5jbG9zZWQkLnBpcGUoXG4gICAgICAgIHRha2UoMSksXG4gICAgICAgIGZpbmFsaXplKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNsZWFudXBEaWFsb2coXG4gICAgICAgICAgICBkaWFsb2dSZWYubmF0aXZlRGlhbG9nLmlkLFxuICAgICAgICAgICAgaG9zdENvbXBvbmVudFJlZixcbiAgICAgICAgICAgIHZpZXdSZWZcbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGRpYWxvZyByZWZlcmVuY2UsIGluY2x1ZGluZyBET00gZWxlbWVudCBjcmVhdGlvbiBhbmQgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHRlbXBsYXRlIFJlc3VsdCBUaGUgdHlwZSBvZiByZXN1bHQgdGhlIGRpYWxvZyB3aWxsIHJldHVybi5cbiAgICogQHBhcmFtIHtJRGlhbG9nQ29uZmlnfSBjb25maWcgVGhlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBkaWFsb2cuXG4gICAqIEByZXR1cm5zIHtEaWFsb2dSZWY8UmVzdWx0Pn0gVGhlIGRpYWxvZyByZWZlcmVuY2Ugb2JqZWN0LlxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVEaWFsb2dSZWY8UmVzdWx0Pihjb25maWc6IElEaWFsb2dDb25maWcpOiBEaWFsb2dSZWY8UmVzdWx0PiB7XG4gICAgY29uc3QgbmV3RGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGlhbG9nJyk7XG4gICAgY29uc3QgZGlhbG9nSUQgPSBgZGlhbG9nLSR7RGF0ZS5ub3coKX1gO1xuXG4gICAgbmV3RGlhbG9nLnNldEF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcsICd0cnVlJyk7XG4gICAgbmV3RGlhbG9nLnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKTtcbiAgICBuZXdEaWFsb2cuc2V0QXR0cmlidXRlKCdpZCcsIGRpYWxvZ0lEKTtcblxuICAgIG5ld0RpYWxvZy5jbGFzc0xpc3QuYWRkKCduZ3gtemVyby1kaWFsb2cnKTtcblxuICAgIGlmIChjb25maWcuZGlhbG9nTm9kZUNsYXNzKSB7XG4gICAgICBuZXdEaWFsb2cuY2xhc3NMaXN0LmFkZChjb25maWcuZGlhbG9nTm9kZUNsYXNzKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmFuaW1hdGVkKSB7XG4gICAgICBuZXdEaWFsb2cuY2xhc3NMaXN0LmFkZCgnbmd4LXplcm8tZGlhbG9nLWhpZGRlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdEaWFsb2cuY2xhc3NMaXN0LmFkZCgnbmd4LXplcm8tZGlhbG9nLXZpc2libGUnKTtcbiAgICB9XG5cbiAgICBjb25zdCBkaWFsb2dSZWYgPSBuZXcgRGlhbG9nUmVmPFJlc3VsdD4obmV3RGlhbG9nLCBjb25maWcuYW5pbWF0ZWQpO1xuXG4gICAgcmV0dXJuIGRpYWxvZ1JlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbnMgdXAgdGhlIGRpYWxvZyBhZnRlciBpdCBpcyBjbG9zZWQsIGluY2x1ZGluZyByZW1vdmluZyBpdCBmcm9tIHRoZSBET00gYW5kIGRlc3Ryb3lpbmcgdmlld3MuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkaWFsb2dJRCBUaGUgSUQgb2YgdGhlIGRpYWxvZyBlbGVtZW50IHRvIHJlbW92ZS5cbiAgICogQHBhcmFtIHtDb21wb25lbnRSZWY8YW55Pn0gZGlhbG9nSG9zdFJlZiBUaGUgcmVmZXJlbmNlIHRvIHRoZSBob3N0IGNvbXBvbmVudC5cbiAgICogQHBhcmFtIHtFbWJlZGRlZFZpZXdSZWY8YW55Pn0gdmlld1JlZiBUaGUgcmVmZXJlbmNlIHRvIHRoZSBlbWJlZGRlZCB2aWV3LlxuICAgKi9cbiAgcHJpdmF0ZSBjbGVhbnVwRGlhbG9nKFxuICAgIGRpYWxvZ0lEOiBzdHJpbmcsXG4gICAgZGlhbG9nSG9zdFJlZjogQ29tcG9uZW50UmVmPGFueT4sXG4gICAgdmlld1JlZjogRW1iZWRkZWRWaWV3UmVmPGFueT5cbiAgKSB7XG4gICAgdmlld1JlZi5kZXN0cm95KCk7XG5cbiAgICBkaWFsb2dIb3N0UmVmLmhvc3RWaWV3LmRlc3Ryb3koKTtcbiAgICBkaWFsb2dIb3N0UmVmLmRlc3Ryb3koKTtcblxuICAgIHRoaXMuZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZCh0aGlzLm5neFplcm9EaWFsb2dDb25maWcuY29udGFpbmVyTm9kZUlEKSFcbiAgICAgIC5yZW1vdmVDaGlsZCh0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpYWxvZ0lEKSEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgcm9vdCBET00gbm9kZSBvZiBhIGR5bmFtaWNhbGx5IGNyZWF0ZWQgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbXBvbmVudFJlZjxhbnk+fSBjb21wb25lbnRSZWYgVGhlIHJlZmVyZW5jZSB0byB0aGUgZHluYW1pY2FsbHkgY3JlYXRlZCBjb21wb25lbnQuXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gVGhlIHJvb3QgRE9NIG5vZGUgb2YgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIHByaXZhdGUgZ2V0Q29tcG9uZW50Um9vdE5vZGUoY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8YW55Pik6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gKGNvbXBvbmVudFJlZi5ob3N0VmlldyBhcyBFbWJlZGRlZFZpZXdSZWY8YW55PilcbiAgICAgIC5yb290Tm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogTm9ybWFsaXplcyB0aGUgZGlhbG9nIGNvbmZpZ3VyYXRpb24gYnkgbWVyZ2luZyBkZWZhdWx0cyB3aXRoIHByb3ZpZGVkIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7SURpYWxvZ0NvbmZpZ30gW2NvbmZpZ10gVGhlIHByb3ZpZGVkIGRpYWxvZyBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyB7V2l0aFJlcXVpcmVkUHJvcGVydGllczxJRGlhbG9nQ29uZmlnPn0gVGhlIG5vcm1hbGl6ZWQgZGlhbG9nIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBwcml2YXRlIG5vcm1hbGl6ZUNvbmZpZyhcbiAgICBjb25maWc/OiBJRGlhbG9nQ29uZmlnXG4gICk6IFdpdGhSZXF1aXJlZFByb3BlcnRpZXM8SURpYWxvZ0NvbmZpZz4ge1xuICAgIHJldHVybiB7XG4gICAgICBjbG9zZU9uQmFja2Ryb3BDbGljazogY29uZmlnPy5jbG9zZU9uQmFja2Ryb3BDbGljayA/PyB0cnVlLFxuICAgICAgZGlhbG9nRGF0YTogY29uZmlnPy5kaWFsb2dEYXRhID8/IHt9LFxuICAgICAgaG9zdENvbXBvbmVudDogY29uZmlnPy5ob3N0Q29tcG9uZW50LFxuICAgICAgYW5pbWF0ZWQ6XG4gICAgICAgIHRoaXMubmd4WmVyb0RpYWxvZ0NvbmZpZy5lbmFibGVBbmltYXRpb25zID8/IGNvbmZpZz8uYW5pbWF0ZWQgPz8gdHJ1ZSxcbiAgICAgIGhvc3REYXRhOiBjb25maWc/Lmhvc3REYXRhID8/IHt9LFxuICAgIH0gYXMgV2l0aFJlcXVpcmVkUHJvcGVydGllczxJRGlhbG9nQ29uZmlnPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY3VzdG9tIGluamVjdG9yIGZvciBpbmplY3RpbmcgZGlhbG9nLXNwZWNpZmljIGRlcGVuZGVuY2llcyBpbnRvIHRoZSBkaWFsb2cgY29tcG9uZW50IG9yIHRlbXBsYXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge0luamVjdG9yfSBwYXJlbnRJbmplY3RvciBUaGUgcGFyZW50IGluamVjdG9yLlxuICAgKiBAcGFyYW0ge0RpYWxvZ1JlZn0gZGlhbG9nUmVmIFRoZSBkaWFsb2cgcmVmZXJlbmNlLlxuICAgKiBAcGFyYW0ge0lEaWFsb2dEYXRhfSBkYXRhIFRoZSBkYXRhIHRvIGluamVjdCBpbnRvIHRoZSBkaWFsb2cuXG4gICAqIEByZXR1cm5zIHtJbmplY3Rvcn0gVGhlIGNyZWF0ZWQgY3VzdG9tIGluamVjdG9yLlxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVEaWFsb2dJbmplY3RvcihcbiAgICBwYXJlbnRJbmplY3RvcjogSW5qZWN0b3IsXG4gICAgZGlhbG9nUmVmOiBEaWFsb2dSZWYsXG4gICAgZGF0YTogSURpYWxvZ0RhdGFcbiAgKTogSW5qZWN0b3Ige1xuICAgIHJldHVybiBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiBwYXJlbnRJbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRElBTE9HX1JFRixcbiAgICAgICAgICB1c2VWYWx1ZTogZGlhbG9nUmVmLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRElBTE9HX0RBVEEsXG4gICAgICAgICAgdXNlVmFsdWU6IGRhdGEsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjdXN0b20gaW5qZWN0b3IgZm9yIGluamVjdGluZyBob3N0LXNwZWNpZmljIGRlcGVuZGVuY2llcyBpbnRvIHRoZSBob3N0IGNvbXBvbmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtJbmplY3Rvcn0gcGFyZW50SW5qZWN0b3IgVGhlIHBhcmVudCBpbmplY3Rvci5cbiAgICogQHBhcmFtIHtJSG9zdERhdGF9IGhvc3REYXRhIFRoZSBkYXRhIHNwZWNpZmljIHRvIHRoZSBob3N0IGNvbXBvbmVudC5cbiAgICogQHBhcmFtIHtJRGlhbG9nQ29uZmlnfSBkaWFsb2dDb25maWcgVGhlIGRpYWxvZyBjb25maWd1cmF0aW9uLlxuICAgKiBAcGFyYW0ge0RpYWxvZ1JlZn0gZGlhbG9nUmVmIFRoZSBkaWFsb2cgcmVmZXJlbmNlLlxuICAgKiBAcmV0dXJucyB7SW5qZWN0b3J9IFRoZSBjcmVhdGVkIGN1c3RvbSBpbmplY3Rvci5cbiAgICovXG4gIHByaXZhdGUgY3JlYXRlSG9zdEluamVjdG9yKFxuICAgIHBhcmVudEluamVjdG9yOiBJbmplY3RvcixcbiAgICBob3N0RGF0YTogSUhvc3REYXRhLFxuICAgIGRpYWxvZ0NvbmZpZzogSURpYWxvZ0NvbmZpZyxcbiAgICBkaWFsb2dSZWY6IERpYWxvZ1JlZlxuICApOiBJbmplY3RvciB7XG4gICAgcmV0dXJuIEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHBhcmVudEluamVjdG9yLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBIT1NUX0RBVEEsXG4gICAgICAgICAgdXNlVmFsdWU6IGhvc3REYXRhLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRElBTE9HX0NPTkZJRyxcbiAgICAgICAgICB1c2VWYWx1ZTogZGlhbG9nQ29uZmlnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRElBTE9HX1JFRixcbiAgICAgICAgICB1c2VWYWx1ZTogZGlhbG9nUmVmLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuIl19