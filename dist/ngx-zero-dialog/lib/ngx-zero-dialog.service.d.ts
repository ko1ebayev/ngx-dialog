import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Component } from './models/component.interface';
import { IDialogConfig } from './models/dialog-config.interface';
import { DialogResult } from './models/dialog-result.type';
import * as i0 from "@angular/core";
/**
 * NgxZeroDialogService managing dialog creation, configuration, and lifecycle in Angular.
 * It supports opening dialogs with components or templates, injecting dependencies,
 * and handling cleanup after dialog closure.
 *
 * @export
 * @class NgxZeroDialogService
 */
export declare class NgxZeroDialogService {
    private readonly ngxZeroDialogConfig;
    private readonly parentInjector;
    private readonly appRef;
    private readonly document;
    /**
     * Opens a dialog with the specified template or component.
     * The dialog configuration allows customization of behavior, data, and animations.
     *
     * @template Result The type of result the dialog will return.
     * @param {Component | TemplateRef<any>} templateOrComponent The component or template to render in the dialog.
     * @param {IDialogConfig} [config] Optional dialog configuration.
     * @returns {Observable<DialogResult<Result>>} Observable emitting the result of the dialog on closure.
     */
    openDialog<Result>(templateOrComponent: Component | TemplateRef<any>, config?: IDialogConfig): Observable<DialogResult<Result>>;
    /**
     * Creates a new dialog reference, including DOM element creation and configuration.
     *
     * @template Result The type of result the dialog will return.
     * @param {IDialogConfig} config The configuration for the dialog.
     * @returns {DialogRef<Result>} The dialog reference object.
     */
    private createDialogRef;
    /**
     * Cleans up the dialog after it is closed, including removing it from the DOM and destroying views.
     *
     * @param {string} dialogID The ID of the dialog element to remove.
     * @param {ComponentRef<any>} dialogHostRef The reference to the host component.
     * @param {EmbeddedViewRef<any>} viewRef The reference to the embedded view.
     */
    private cleanupDialog;
    /**
     * Retrieves the root DOM node of a dynamically created component.
     *
     * @param {ComponentRef<any>} componentRef The reference to the dynamically created component.
     * @returns {HTMLElement} The root DOM node of the component.
     */
    private getComponentRootNode;
    /**
     * Normalizes the dialog configuration by merging defaults with provided options.
     *
     * @param {IDialogConfig} [config] The provided dialog configuration.
     * @returns {WithRequiredProperties<IDialogConfig>} The normalized dialog configuration.
     */
    private normalizeConfig;
    /**
     * Creates a custom injector for injecting dialog-specific dependencies into the dialog component or template.
     *
     * @param {Injector} parentInjector The parent injector.
     * @param {DialogRef} dialogRef The dialog reference.
     * @param {IDialogData} data The data to inject into the dialog.
     * @returns {Injector} The created custom injector.
     */
    private createDialogInjector;
    /**
     * Creates a custom injector for injecting host-specific dependencies into the host component.
     *
     * @param {Injector} parentInjector The parent injector.
     * @param {IHostData} hostData The data specific to the host component.
     * @param {IDialogConfig} dialogConfig The dialog configuration.
     * @param {DialogRef} dialogRef The dialog reference.
     * @returns {Injector} The created custom injector.
     */
    private createHostInjector;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxZeroDialogService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxZeroDialogService>;
}
