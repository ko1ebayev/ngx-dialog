import { ApplicationRef, inject, Injectable, Injector } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { DialogRef } from './dialog-ref';
import { ComponentType } from './interfaces/component-type.interface';
import { DialogConfig } from './interfaces/dialog-config.interface';
import { DialogData } from './interfaces/dialog-data.interface';
import { PortalService } from './portal.service';
import { NGX_DIALOG_CONFIG } from './providers/dialog-config.token';
import { NGX_DIALOG_DATA } from './providers/dialog-data.token';
import { NGX_DIALOG_REF } from './providers/dialog-ref.token';

@Injectable({ providedIn: 'root' })
export class DialogService {
  readonly portalService = inject(PortalService);

  readonly parentInjector = inject(Injector);

  readonly appRef = inject(ApplicationRef);

  openDialog<Result>(
    component: ComponentType<unknown>,
    config: DialogConfig,
    data: DialogData
  ): Observable<Result> {
    const { hostRef, dialog } = this.portalService.hostDialog();

    hostRef.changeDetectorRef.detectChanges();

    const dialogRef = new DialogRef<Result>(dialog);
    const injector = this.createInjector(
      dialogRef,
      config,
      data,
      this.appRef.injector
    );

    const componentRef =
      hostRef.instance.contentInsertionPoint.viewContainerRef.createComponent(
        component,
        { injector }
      );
    // (componentRef.instance as any).ref = dialog;
    // (componentRef.instance as any).dref = dialogRef;
    componentRef.changeDetectorRef.detectChanges();

    dialog.showModal();

    return dialogRef.closed$.pipe(
      take(1),
      tap(() => {
        this.portalService.clearHost(hostRef, dialog.getAttribute('id')!);
      })
    );
  }

  private createInjector<Result>(
    dialogRef: DialogRef<Result>,
    config: DialogConfig,
    data: DialogData,
    parentInjector: Injector
  ): Injector {
    return Injector.create({
      parent: parentInjector,
      providers: [
        {
          provide: NGX_DIALOG_REF,
          useValue: dialogRef,
        },
        {
          provide: NGX_DIALOG_CONFIG,
          useValue: config,
        },
        {
          provide: NGX_DIALOG_DATA,
          useValue: data,
        },
      ],
    });
  }
}
