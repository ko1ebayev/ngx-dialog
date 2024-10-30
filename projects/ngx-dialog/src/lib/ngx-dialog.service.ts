import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  inject,
  Injectable,
  Injector,
  TemplateRef,
} from '@angular/core';
import { finalize, Observable, take } from 'rxjs';

import { NGX_DIALOG } from '../public-api';
import { createDialogInjector } from './create-dialog-injector';
import { NgxDialogHostComponent } from './dialog-host/dialog-host.component';
import { DialogRef } from './dialog-ref';
import { ComponentType } from './models/component-type.interface';
import { DialogConfig } from './models/dialog-config.interface';
import { DialogData } from './models/dialog-data.interface';

@Injectable({ providedIn: 'root' })
export class NgxDialogService {
  private readonly ngxDialog = inject<{
    hostID: string;
    htmlDialogClass?: string;
  }>(NGX_DIALOG);

  private readonly parentInjector = inject(Injector);

  private readonly appRef = inject(ApplicationRef);

  private readonly document = inject(DOCUMENT);

  openDialog<Result>(
    templateRef: TemplateRef<unknown>,
    config?: DialogConfig,
    data?: DialogData
  ): Observable<Result>;
  openDialog<Result>(
    component: ComponentType<unknown>,
    config?: DialogConfig,
    data?: DialogData
  ): Observable<Result>;
  openDialog<Result>(
    componentOrTemplateRef: ComponentType<unknown> | TemplateRef<unknown>,
    configOrData?: DialogConfig | DialogData,
    data?: DialogData
  ): Observable<Result>;
  openDialog<Result>(
    componentOrTemplateRef: ComponentType<unknown> | TemplateRef<unknown>,
    configOrData?: DialogConfig | DialogData,
    data?: DialogData
  ): Observable<Result> {
    let config: DialogConfig | undefined;
    let dialogData: DialogData | undefined;

    if (configOrData) {
      if (this.isConfig(configOrData)) {
        config = configOrData;
        dialogData = data;
      } else {
        config = undefined;
        dialogData = configOrData;
      }
    }

    return componentOrTemplateRef instanceof TemplateRef
      ? this._openDialogFromTemplate<Result>(
          componentOrTemplateRef,
          config,
          dialogData
        )
      : this._openDialogFromComponent<Result>(
          componentOrTemplateRef,
          config,
          dialogData
        );
  }

  private _openDialogFromTemplate<Result>(
    templateRef: TemplateRef<unknown>,
    config?: DialogConfig,
    data?: DialogData
  ): Observable<Result> {
    const normalizedConfig = this.normalizeConfig(config || {});

    const dialogRef = this.createDialogRef<Result>(normalizedConfig);

    const injector = createDialogInjector(this.parentInjector, {
      dialogRef: <DialogRef<unknown>>dialogRef,
      dialogConfig: normalizedConfig,
      data: data || {},
    });

    const ngxDialogHostRef = createComponent(NgxDialogHostComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: injector,
    });

    this.appRef.attachView(ngxDialogHostRef.hostView);

    this.document
      .getElementById(this.ngxDialog.hostID)!
      .appendChild(dialogRef.nativeDialog);

    dialogRef.nativeDialog.appendChild(
      this.getComponentRootNode(ngxDialogHostRef)
    );

    const evr = ngxDialogHostRef.instance.contentInsertionPoint.viewContainerRef.createEmbeddedView(
      templateRef,
      {
        $implicit: dialogRef,
        data,
        config,
        injector,
      }
    );
    console.log(evr);

    dialogRef.nativeDialog.showModal();

    return dialogRef.closed$.pipe(
      take(1),
      finalize(() => {
        this.destroyDialog(ngxDialogHostRef, dialogRef.dialogID);
      })
    );
  }

  private _openDialogFromComponent<Result>(
    component: ComponentType,
    config?: DialogConfig,
    data?: DialogData
  ): Observable<Result> {
    const normalizedConfig = this.normalizeConfig(config || {});

    const dialogRef = this.createDialogRef<Result>(normalizedConfig);

    const injector = createDialogInjector(this.parentInjector, {
      dialogRef: <DialogRef<unknown>>dialogRef,
      dialogConfig: normalizedConfig,
      data: data || {},
    });

    const ngxDialogHostRef = createComponent(NgxDialogHostComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: injector,
    });

    this.appRef.attachView(ngxDialogHostRef.hostView);

    this.document
      .getElementById(this.ngxDialog.hostID)!
      .appendChild(dialogRef.nativeDialog);

    dialogRef.nativeDialog.appendChild(
      this.getComponentRootNode(ngxDialogHostRef)
    );

    ngxDialogHostRef.instance.contentInsertionPoint.viewContainerRef.createComponent(
      component,
      { injector }
    );

    dialogRef.nativeDialog.showModal();

    return dialogRef.closed$.pipe(
      take(1),
      finalize(() => {
        this.destroyDialog(ngxDialogHostRef, dialogRef.dialogID);
      })
    );
  }

  private createDialogRef<R>(config: DialogConfig): DialogRef<R> {
    const newDialog = document.createElement('dialog');

    const dialogID = window.crypto.randomUUID();

    newDialog.setAttribute('id', dialogID);

    newDialog.setAttribute(
      'class',
      `ngx-dialog-reset ngx-dialog-host-animation ${config.htmlDialogClass}`
    );

    const dialogRef = new DialogRef<R>(newDialog, dialogID);

    return dialogRef;
  }

  private destroyDialog(hostRef: ComponentRef<unknown>, id: string): void {
    hostRef.hostView.destroy();
    hostRef.destroy();
    this.document
      .getElementById(this.ngxDialog.hostID)!
      .removeChild(this.document.getElementById(id)!);
  }

  private getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
  }

  private isConfig(obj: object): obj is DialogConfig {
    return obj && ('closeOnBackdropClick' in obj || 'htmlDialogClass' in obj);
  }

  private normalizeConfig(config: Partial<DialogConfig>): DialogConfig {
    let normalizedConfig = {};

    if (config.closeOnBackdropClick === undefined) {
      normalizedConfig = { ...normalizedConfig, closeOnBackdropClick: true };
    }

    if (config.htmlDialogClass === undefined) {
      if (this.ngxDialog.htmlDialogClass) {
        normalizedConfig = {
          ...normalizedConfig,
          htmlDialogClass: this.ngxDialog.htmlDialogClass,
        };
      }
    }
    return normalizedConfig as DialogConfig;
  }
}
