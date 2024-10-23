import { inject, Injectable, Injector } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { DialogRef } from './dialog-ref';
import { ComponentType } from './interfaces/component-type.interface';
import { DialogConfig } from './interfaces/dialog-config.interface';
import { DialogData } from './interfaces/dialog-data.interface';
import { PortalService } from './portal.service';
import { NGX_DIALOG_CONFIG } from './providers/dialog-config.token';
import { NGX_DIALOG_DATA } from './providers/dialog-data.token';
import { NGX_DIALOG_REF } from './providers/dialog-ref.token';

// TODO WORK ON DATA & CONFIG SIGNATURES & OVERLOAD SIGNATURES

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly portalService = inject(PortalService);

  private readonly parentInjector = inject(Injector);

  openDialog<Result>(
    component: ComponentType<unknown>,
    config: DialogConfig,
    data: DialogData
  ): Observable<Result> {
    const { hostRef, dialog } = this.portalService.hostDialog();

    const dialogRef = new DialogRef<Result>(dialog);
    const injector = this.createInjector(dialogRef, config, data);

    console.log(hostRef);

    hostRef.instance.contentInsertionPoint.viewContainerRef.createComponent(
      component,
      { injector }
    );

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
    data: DialogData
  ): Injector {
    return Injector.create({
      parent: this.parentInjector,
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
