import { Component } from './component.interface';
import { IDialogData } from './dialog-data.interface';
import { IHostData } from './host-data.interface';

export interface IDialogConfig {
  hostComponent: Component;
  hostData?: IHostData;
  closeOnBackdropClick?: boolean;
  dialogNodeClass?: string;
  data?: IDialogData;
  animated?: boolean;
}
