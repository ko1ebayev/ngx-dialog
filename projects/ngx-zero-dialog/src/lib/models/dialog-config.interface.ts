import { Component } from './component.interface';
import { IDialogData } from './dialog-data.interface';

export interface IDialogConfig {
  closeOnBackdropClick?: boolean;
  dialogNodeClass?: string;
  data?: IDialogData;
  hostComponent?: Component;
  animated?: boolean;
}
