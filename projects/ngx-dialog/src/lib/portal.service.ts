import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  inject,
  Injectable,
} from '@angular/core';
import { NgxDialogHostComponent } from './dialog-host/dialog-host.component';
import { NgxDialog } from './interfaces/ngx-dialog-config.interface';
import { NGX_DIALOG } from './providers/provide-ngx-dialog';

@Injectable({ providedIn: 'root' })
export class PortalService {
  private readonly ngxDialog = inject<NgxDialog>(NGX_DIALOG);

  private readonly document = inject(DOCUMENT);

  private readonly appRef = inject(ApplicationRef);

  hostDialog() {
    const nativeDialog = this.createNativeDialog();
    const hostComponentRef = createComponent(NgxDialogHostComponent, {
      environmentInjector: this.appRef.injector,
    });
    hostComponentRef.setInput('nativeDialogRef', nativeDialog);
    this.document
      .getElementById(this.ngxDialog.hostID)!
      .appendChild(nativeDialog);
    nativeDialog.appendChild(this._getComponentRootNode(hostComponentRef));
    return { hostRef: hostComponentRef, dialog: nativeDialog };
  }

  clearHost(hostRef: ComponentRef<unknown>, id: string) {
    hostRef.hostView.destroy();
    hostRef.destroy();
    const el = this.document
      .getElementById(this.ngxDialog.hostID)!
      .removeChild(this.document.getElementById(id)!);
    console.log(hostRef, el);
  }

  private _getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
  }

  private createNativeDialog() {
    const newDialog = document.createElement('dialog');

    const id = window.crypto.randomUUID();
    newDialog.setAttribute('id', id);

    return newDialog;
  }
}
