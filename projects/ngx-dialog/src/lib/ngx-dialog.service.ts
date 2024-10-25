import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  inject,
  Injectable,
  Injector,
} from '@angular/core';
import { finalize, Observable, take } from 'rxjs';
import { NGX_DIALOG } from '../public-api';
import { NgxDialogHostComponent } from './dialog-host/dialog-host.component';
import { DialogRef } from './dialog-ref';
import { ComponentType } from './interfaces/component-type.interface';
import { DialogConfig } from './interfaces/dialog-config.interface';
import { DialogData } from './interfaces/dialog-data.interface';
import { NgxDialog } from './interfaces/ngx-dialog-config.interface';
import { createDialogInjector } from './utils/create-dialog-injector';

// TODO WORK ON DATA & CONFIG SIGNATURES & OVERLOAD SIGNATURES
@Injectable({ providedIn: 'root' })
export class NgxDialogService {
  private readonly ngxDialog = inject<NgxDialog>(NGX_DIALOG);

  private readonly parentInjector = inject(Injector);

  private readonly appRef = inject(ApplicationRef)

  private readonly document = inject(DOCUMENT);

  openDialog<R>(
    component: ComponentType<unknown>,
    config: DialogConfig,
    data: DialogData
  ): Observable<R> {
    const dialogRef = this.createDialogRef<R>();

    const injector = createDialogInjector(this.parentInjector, {
      dialogRef: <DialogRef<unknown>>dialogRef,
      dialogConfig: config,
      data,
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
        this.destroyDialog(
          ngxDialogHostRef,
          dialogRef.dialogID
        );
      })
    );
  }

  private createDialogRef<R>(): DialogRef<R> {
    const newDialog = document.createElement('dialog');

    const dialogID = window.crypto.randomUUID();

    newDialog.setAttribute('id', dialogID);

    newDialog.setAttribute(
      'class',
      'ngx-dialog-reset ngx-dialog-host-animation'
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
}
