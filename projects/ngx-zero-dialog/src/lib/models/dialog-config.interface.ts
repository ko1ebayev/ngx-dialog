import { Component } from './component.interface';
import { IDialogData } from './dialog-data.interface';

export interface IDialogConfig {
  closeOnBackdropClick?: boolean;
  backdropClass?: string;
  dialogNodeClass?: string;
  data?: IDialogData;
  hostComponent?: Component;
}
