import { Component } from './component.interface';
import { IDialogData } from './dialog-data.interface';
import { IHostData } from './host-data.interface';

export interface IDialogConfig {
  closeOnBackdropClick?: boolean;
  hostComponent: Component;
  hostData?: IHostData;
  dialogNodeClass?: string;
  dialogData?: IDialogData;
  animated?: boolean;
}
