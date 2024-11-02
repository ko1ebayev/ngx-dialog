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
import { defer, finalize, Observable, of, switchMap, take, tap } from 'rxjs';

import { NGX_DIALOG } from '../public-api';
import { createDialogInjector } from './create-dialog-injector';
import { NgxDialogHostComponent } from './dialog-host/dialog-host.component';
import { DialogRef } from './dialog-ref';
import { ComponentType } from './models/component-type.interface';
import { DialogConfig } from './models/dialog-config.interface';

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
    templateOrComponent: ComponentType<any> | TemplateRef<any>,
    config?: DialogConfig
  ): Observable<Result> {
    const normalizedConfig = this.normalizeConfig(config);

    const dialogRef = this.createDialogRef<Result>(normalizedConfig);

    const injector = createDialogInjector(this.parentInjector, {
      dialogRef: <DialogRef<unknown>>dialogRef,
      dialogConfig: normalizedConfig,
      data: config?.data || {},
    });

    const ngxDialogHostRef = createComponent(
      config?.hostComponent || NgxDialogHostComponent,
      {
        environmentInjector: this.appRef.injector,
        elementInjector: injector,
      }
    );

    this.appRef.attachView(ngxDialogHostRef.hostView);

    this.document
      .getElementById(this.ngxDialog.hostID)!
      .appendChild(dialogRef.nativeDialog);

    dialogRef.nativeDialog.appendChild(
      this.getComponentRootNode(ngxDialogHostRef)
    );

    if (templateOrComponent instanceof TemplateRef) {
      ngxDialogHostRef.instance.contentInsertionPoint.viewContainerRef.createEmbeddedView(
        templateOrComponent,
        {
          $implicit: dialogRef,
          data: config?.data || {},
          config,
          injector,
        }
      );
    } else {
      ngxDialogHostRef.instance.contentInsertionPoint.viewContainerRef.createComponent(
        templateOrComponent,
        { injector }
      );
    }

    return defer(() => of(void 0)).pipe(
      tap(() => dialogRef.nativeDialog.showModal()),
      switchMap(() => dialogRef.closed$.pipe(
        take(1),
        finalize(() => {
          this.destroyDialog(ngxDialogHostRef, dialogRef.dialogID);
        })
      ))
    );
    // dialogRef.nativeDialog.showModal();

    // return dialogRef.closed$.pipe(
    //   take(1),
    //   finalize(() => {
    //     this.destroyDialog(ngxDialogHostRef, dialogRef.dialogID);
    //   })
    // );
  }

  private createDialogRef<R>(config: DialogConfig): DialogRef<R> {
    const newDialog = document.createElement('dialog');

    const dialogID = window.crypto.randomUUID();

    newDialog.setAttribute('aria-modal', 'true');

    newDialog.setAttribute('role', 'dialog');

    newDialog.setAttribute('id', dialogID);

    newDialog.setAttribute(
      'class',
      `ngx-dialog-reset ngx-dialog-host-animation ${config.htmlDialogClass}`
    );

    const dialogRef = new DialogRef<R>(newDialog, dialogID);

    return dialogRef;
  }

  private destroyDialog(hostRef: ComponentRef<any>, id: string) {
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

  private normalizeConfig(config: DialogConfig | undefined): DialogConfig {
    let normalizedConfig = {};

    if (config?.closeOnBackdropClick === undefined) {
      normalizedConfig = { ...normalizedConfig, closeOnBackdropClick: true };
    }

    if (config?.htmlDialogClass === undefined) {
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
