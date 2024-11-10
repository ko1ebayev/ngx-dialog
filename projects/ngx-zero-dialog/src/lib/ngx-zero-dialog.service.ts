import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  inject,
  Injectable,
  Injector,
  TemplateRef
} from '@angular/core';
import { defer, finalize, Observable, take } from 'rxjs';

import { DialogRef } from './dialog-ref';
import { Component } from './models/component.interface';
import { IDialogConfig } from './models/dialog-config.interface';
import { IDialogData } from './models/dialog-data.interface';
import { DialogResult } from './models/dialog-result.type';
import { INgxZeroDialogConfig } from './models/ngx-zero-dialog-config.interface';
import { WithRequiredProperties } from './models/with-required-properties.type';
import { NgxZeroDialogDefaultHost } from './ngx-zero-dialog-default-host/ngx-zero-dialog-default-host.component';
import { DIALOG_CONFIG } from './providers/dialog-config.token';
import { DIALOG_DATA } from './providers/dialog-data.token';
import { DIALOG_REF } from './providers/dialog-ref.token';
import { NGX_ZERO_DIALOG_CONFIG } from './providers/provide-ngx-zero-dialog';

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
    return defer(() => {
      const normalizedConfig = this.normalizeConfig(config);

      const dialogRef = this.createDialogRef<Result>(normalizedConfig);

      const injector = this.createDialogInjector(this.parentInjector, {
        dialogRef: <DialogRef<unknown>>dialogRef,
        dialogConfig: normalizedConfig,
        data: normalizedConfig.data,
      });

      const dialogHostRef = createComponent<any>(
        normalizedConfig.hostComponent,
        {
          environmentInjector: this.appRef.injector,
          elementInjector: injector,
        }
      );

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

      dialogRef.nativeDialog.showModal();

      if (normalizedConfig.animated) {
        dialogRef.nativeDialog.classList.add('ngx-zero-dialog-visible');
      }

      return dialogRef.closed$.pipe(
        take(1),
        finalize(() => {
          this.cleanupDialog(dialogHostRef, dialogRef.nativeDialog.id);
        })
      );
    });
  }

  private createDialogRef<Result>(config: IDialogConfig): DialogRef<Result> {
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
    } else {
      newDialog.classList.add('ngx-zero-dialog-visible');
    }

    const dialogRef = new DialogRef<Result>(newDialog, config.animated);

    return dialogRef;
  }

  private cleanupDialog(dialogHostRef: ComponentRef<any>, dialogID: string) {
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
      data: config?.data || {},
      hostComponent:
        config?.hostComponent ??
        this.ngxZeroDialogConfig?.defaultHostComponent ??
        NgxZeroDialogDefaultHost,
      animated:
        this.ngxZeroDialogConfig.enableAnimations ?? config?.animated ?? true,
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
