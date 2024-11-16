import * as i0 from '@angular/core';
import { Directive, InjectionToken, inject, ViewChild, Injector, ApplicationRef, createComponent, TemplateRef, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, defer, take, finalize } from 'rxjs';

/**
 * A structural directive that marks an insertion point for dynamic dialog content.
 * It provides access to a `ViewContainerRef`, which can be used to dynamically
 * insert templates or components into the dialog.
 *
 * @export
 * @class DialogContentDirective
 */
class DialogContentDirective {
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

const DIALOG_CONFIG = new InjectionToken('DIALOG_CONFIG');

const DIALOG_REF = new InjectionToken('DIALOG_REF');

const HOST_DATA = new InjectionToken('HOST_DATA');

/**
 * A base class for creating custom dialog host components in Angular.
 * Provides utilities for managing dialog behavior, injecting dialog-specific dependencies,
 * and enabling custom dialog content insertion.
 *
 * @export
 * @class NgxZeroDialogHost
 * @template HostData The type of the data provided to the host component.
 */
class NgxZeroDialogHost {
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

/**
 * A reference to a dialog, providing methods to control its lifecycle and observe its closure.
 *
 * @export
 * @class DialogRef
 * @template Result The type of the result returned by the dialog when it is closed.
 */
class DialogRef {
    nativeDialog;
    animated;
    /**
     * Subject that emits the result of the dialog when it is closed.
     * @private
     */
    #_closed$ = new Subject();
    /**
     * Observable that emits the result of the dialog when it is closed.
     * Consumers can subscribe to this observable to react to dialog closure.
     *
     * @readonly
     * @type {Observable<DialogResult<Result>>}
     */
    closed$ = this.#_closed$.asObservable();
    constructor(nativeDialog, animated) {
        this.nativeDialog = nativeDialog;
        this.animated = animated;
    }
    /**
     * Closes the dialog and optionally emits a result.
     * If animations are enabled, the dialog waits for the transition to complete before fully closing.
     *
     * @param {DialogResult<Result>} [value] Optional result to emit upon closure.
     */
    close(value) {
        if (this.animated) {
            this.#terminateAnimatedDialog(value);
        }
        else {
            this.#terminateDialog(value);
        }
    }
    /**
     * Handles the termination of the dialog with animations.
     * It waits for the transition to complete before closing the dialog and emitting the result.
     *
     * @private
     * @param {DialogResult<Result>} [value] Optional result to emit upon closure.
     */
    #terminateAnimatedDialog(value) {
        if (this.animated) {
            this.nativeDialog.classList.remove('ngx-zero-dialog-visible');
            this.nativeDialog.addEventListener('transitionend', () => {
                this.#terminateDialog(value);
            }, { once: true });
        }
        else {
            this.#terminateDialog(value);
        }
    }
    /**
     * Handles the termination of the dialog, closing the native dialog element
     * and emitting the result through the `closed$` observable.
     *
     * @private
     * @param {DialogResult<Result>} [value] Optional result to emit upon closure.
     */
    #terminateDialog(value) {
        this.nativeDialog.close();
        this.#_closed$.next(value);
    }
}

const DIALOG_DATA = new InjectionToken('DIALOG_DATA');

const NGX_ZERO_DIALOG_CONFIG = new InjectionToken('NGX_ZERO_DIALOG_CONFIG');
const provideNgxZeroDialog = (config) => {
    return {
        provide: NGX_ZERO_DIALOG_CONFIG,
        useValue: config,
    };
};

/**
 * NgxZeroDialogService managing dialog creation, configuration, and lifecycle in Angular.
 * It supports opening dialogs with components or templates, injecting dependencies,
 * and handling cleanup after dialog closure.
 *
 * @export
 * @class NgxZeroDialogService
 */
class NgxZeroDialogService {
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

/*
 * Public API Surface of ngx-zero-dialog
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DIALOG_CONFIG, DIALOG_DATA, DIALOG_REF, DialogContentDirective, NGX_ZERO_DIALOG_CONFIG, NgxZeroDialogHost, NgxZeroDialogService, provideNgxZeroDialog };
//# sourceMappingURL=ngx-zero-dialog.mjs.map
