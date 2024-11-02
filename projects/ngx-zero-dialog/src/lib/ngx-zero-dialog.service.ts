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
import { defer, finalize, Observable, take } from 'rxjs';

import {
  DIALOG_CONFIG,
  DIALOG_DATA,
  DIALOG_REF,
  NGX_ZERO_DIALOG_CONFIG,
} from '../public-api';
import { NgxZeroDialogDefaultHost } from './default-dialog-host/default-dialog-host.component';
import { DialogRef } from './dialog-ref';
import { Component } from './models/component.interface';
import { IDialogConfig } from './models/dialog-config.interface';
import { IDialogData } from './models/dialog-data.interface';
import { INgxZeroDialogConfig } from './models/ngx-zero-dialog-config.interface';

@Injectable({ providedIn: 'root' })
export class NgxZeroDialogService {
  private readonly ngxDialog = inject<INgxZeroDialogConfig>(
    NGX_ZERO_DIALOG_CONFIG
  );

  private readonly parentInjector = inject(Injector);

  private readonly appRef = inject(ApplicationRef);

  private readonly document = inject(DOCUMENT);

  openDialog<Result>(
    templateOrComponent: Component | TemplateRef<any>,
    config?: IDialogConfig
  ): Observable<Result> {
    const normalizedConfig = this.normalizeConfig(config);

    const dialogRef = this.createDialogRef<Result>(normalizedConfig);

    const injector = this.createDialogInjector(this.parentInjector, {
      dialogRef: <DialogRef<unknown>>dialogRef,
      dialogConfig: normalizedConfig,
      data: config?.data || {},
    });

    const ngxDialogHostRef = createComponent<any>(
      config?.hostComponent || NgxZeroDialogDefaultHost,
      {
        environmentInjector: this.appRef.injector,
        elementInjector: injector,
      }
    );

    this.appRef.attachView(ngxDialogHostRef.hostView);

    this.document
      .getElementById(this.ngxDialog.containerNodeID)!
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

    return defer(() => {
      dialogRef.nativeDialog.showModal();

      return dialogRef.closed$.pipe(
        take(1),
        finalize(() => {
          this.destroyDialog(ngxDialogHostRef, dialogRef.dialogID);
        })
      );
    });
  }

  private createDialogRef<R>(config: IDialogConfig): DialogRef<R> {
    const newDialog = document.createElement('dialog');

    const dialogID = window.crypto.randomUUID();

    newDialog.setAttribute('aria-modal', 'true');

    newDialog.setAttribute('role', 'dialog');

    newDialog.setAttribute('id', dialogID);

    newDialog.setAttribute(
      'class',
      `ngx-zero-dialog-reset ngx-dialog-host-animation ${config.htmlDialogClass}`
    );

    const dialogRef = new DialogRef<R>(newDialog, dialogID);

    return dialogRef;
  }

  private destroyDialog(hostRef: ComponentRef<any>, id: string) {
    hostRef.hostView.destroy();
    hostRef.destroy();
    this.document
      .getElementById(this.ngxDialog.containerNodeID)!
      .removeChild(this.document.getElementById(id)!);
  }

  private getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
  }

  private normalizeConfig(config: IDialogConfig | undefined): IDialogConfig {
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
    return normalizedConfig as IDialogConfig;
  }

  private createDialogInjector(
    parentInjector: Injector,
    tokens: {
      dialogRef: DialogRef;
      dialogConfig: IDialogConfig;
      data: IDialogData;
    }
  ): Injector {
    return Injector.create({
      parent: parentInjector,
      providers: [
        {
          provide: DIALOG_REF,
          useValue: tokens.dialogRef,
        },
        {
          provide: DIALOG_CONFIG,
          useValue: tokens.dialogConfig,
        },
        {
          provide: DIALOG_DATA,
          useValue: tokens.data,
        },
      ],
    });
  }
}
