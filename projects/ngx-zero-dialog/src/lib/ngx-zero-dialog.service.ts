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
import { DialogResult } from './types/dialog-result.type';
import { WithRequiredProperties } from './types/with-required-properties.type';

@Injectable({ providedIn: 'root' })
export class NgxZeroDialogService {
  private readonly ngxZeroDialogConfig = inject<INgxZeroDialogConfig>(
    NGX_ZERO_DIALOG_CONFIG
  );

  private readonly parentInjector = inject(Injector);

  private readonly appRef = inject(ApplicationRef);

  private readonly document = inject(DOCUMENT);

  openDialog<Result>(
    templateOrComponent: Component | TemplateRef<any>,
    config?: IDialogConfig
  ): Observable<DialogResult<Result>> {
    const normalizedConfig = this.normalizeConfig(config);

    const dialogRef = this.createDialogRef<Result>(normalizedConfig);

    const injector = this.createDialogInjector(this.parentInjector, {
      dialogRef: <DialogRef<unknown>>dialogRef,
      dialogConfig: normalizedConfig,
      data: normalizedConfig.data,
    });

    const dialogHostRef = createComponent<any>(normalizedConfig.hostComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: injector,
    });

    this.appRef.attachView(dialogHostRef.hostView);

    this.document
      .getElementById(this.ngxZeroDialogConfig.containerNodeID)!
      .appendChild(dialogRef.nativeDialog);

    dialogRef.nativeDialog.appendChild(
      this.getComponentRootNode(dialogHostRef)
    );

    if (templateOrComponent instanceof TemplateRef) {
      dialogHostRef.instance.contentInsertionPoint.viewContainerRef.createEmbeddedView(
        templateOrComponent,
        {
          $implicit: dialogRef,
          data: normalizedConfig.data,
          config,
          injector,
        }
      );
    } else {
      dialogHostRef.instance.contentInsertionPoint.viewContainerRef.createComponent(
        templateOrComponent,
        { injector }
      );
    }

    return defer(() => {
      dialogRef.nativeDialog.showModal();

      //////// WIP animations
      dialogRef.nativeDialog.classList.add('ngx-zero-dialog-enter');
      dialogRef.nativeDialog.addEventListener(
        'animationend',
        () => {
          dialogRef.nativeDialog.classList.remove('ngx-zero-dialog-enter');
        },
        { once: true }
      );

      return dialogRef.closed$.pipe(
        take(1),
        finalize(() => {
          this.destroyDialog(dialogHostRef, dialogRef.dialogID);
        })
      );
    });
  }

  private createDialogRef<Result>(config: IDialogConfig): DialogRef<Result> {
    const newDialog = document.createElement('dialog');

    const dialogID = window.crypto.randomUUID();

    newDialog.setAttribute('aria-modal', 'true');

    newDialog.setAttribute('role', 'dialog');

    newDialog.setAttribute('id', dialogID);

    newDialog.setAttribute(
      'class',
      `ngx-zero-dialog-reset ${config.backdropClass} ${config.dialogNodeClass}`
    );

    const dialogRef = new DialogRef<Result>(newDialog, dialogID);

    return dialogRef;
  }

  private destroyDialog(dialogHostRef: ComponentRef<any>, dialogID: string) {
    dialogHostRef.hostView.destroy();
    dialogHostRef.destroy();
    this.document
      .getElementById(this.ngxZeroDialogConfig.containerNodeID)!
      .removeChild(this.document.getElementById(dialogID)!);
  }

  private getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
  }

  private normalizeConfig(
    config?: IDialogConfig
  ): WithRequiredProperties<IDialogConfig> {
    return {
      closeOnBackdropClick: config?.closeOnBackdropClick || true,

      backdropClass:
        config?.backdropClass ||
        this.ngxZeroDialogConfig?.backdropClass ||
        'ngx-zero-dialog-backdrop',

      data: config?.data || {},

      hostComponent:
        config?.hostComponent ||
        this.ngxZeroDialogConfig?.defaultHostComponent ||
        NgxZeroDialogDefaultHost,
    } as WithRequiredProperties<IDialogConfig>;
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
