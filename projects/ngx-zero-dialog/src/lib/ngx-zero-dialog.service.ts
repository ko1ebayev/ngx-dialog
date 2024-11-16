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

import { DialogRef } from './dialog-ref';
import { Component } from './models/component.interface';
import { IDialogConfig } from './models/dialog-config.interface';
import { IDialogData } from './models/dialog-data.interface';
import { DialogResult } from './models/dialog-result.type';
import { IHostData } from './models/host-data.interface';
import { INgxZeroDialogConfig } from './models/ngx-zero-dialog-config.interface';
import { WithRequiredProperties } from './models/with-required-properties.type';
import { DIALOG_CONFIG } from './providers/dialog-config.token';
import { DIALOG_DATA } from './providers/dialog-data.token';
import { DIALOG_REF } from './providers/dialog-ref.token';
import { HOST_DATA } from './providers/host-data.token';
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

      const dialogInjector = this.createDialogInjector(
        this.parentInjector,
        <DialogRef<unknown>>dialogRef,
        normalizedConfig.dialogData
      );

      const hostInjector = this.createHostInjector(
        this.parentInjector,
        normalizedConfig.hostData,
        normalizedConfig,
        <DialogRef<unknown>>dialogRef
      );

      const hostComponentRef = createComponent<any>(
        normalizedConfig.hostComponent,
        {
          environmentInjector: this.appRef.injector,
          elementInjector: hostInjector,
        }
      );

      this.appRef.attachView(hostComponentRef.hostView);

      this.document
        .getElementById(this.ngxZeroDialogConfig.containerNodeID)!
        .appendChild(dialogRef.nativeDialog);

      dialogRef.nativeDialog.appendChild(
        this.getComponentRootNode(hostComponentRef)
      );

      let viewRef: EmbeddedViewRef<any>;

      if (templateOrComponent instanceof TemplateRef) {
        viewRef =
          hostComponentRef.instance.contentInsertionPoint.viewContainerRef.createEmbeddedView(
            templateOrComponent,
            {
              $implicit: dialogRef,
              data: normalizedConfig.dialogData,
              injector: dialogInjector,
            }
          );
      } else {
        viewRef =
          hostComponentRef.instance.contentInsertionPoint.viewContainerRef.createComponent(
            templateOrComponent,
            { injector: dialogInjector }
          );
      }

      dialogRef.nativeDialog.showModal();

      if (normalizedConfig.animated) {
        dialogRef.nativeDialog.classList.add('ngx-zero-dialog-visible');
      }

      return dialogRef.closed$.pipe(
        take(1),
        finalize(() => {
          this.cleanupDialog(
            dialogRef.nativeDialog.id,
            hostComponentRef,
            viewRef
          );
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

  private cleanupDialog(
    dialogID: string,
    dialogHostRef: ComponentRef<any>,
    viewRef: EmbeddedViewRef<any>
  ) {
    viewRef.destroy();

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
      closeOnBackdropClick: config?.closeOnBackdropClick ?? true,
      dialogData: config?.dialogData ?? {},
      hostComponent: config?.hostComponent,
      animated:
        this.ngxZeroDialogConfig.enableAnimations ?? config?.animated ?? true,
      hostData: config?.hostData ?? {},
    } as WithRequiredProperties<IDialogConfig>;
  }

  private createDialogInjector(
    parentInjector: Injector,
    dialogRef: DialogRef,
    data: IDialogData
  ): Injector {
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

  private createHostInjector(
    parentInjector: Injector,
    hostData: IHostData,
    dialogConfig: IDialogConfig,
    dialogRef: DialogRef
  ): Injector {
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
}
