import { Component } from "./component.interface";
import { IDialogData } from "./dialog-data.interface";

export interface IDialogConfig {
  closeOnBackdropClick?: boolean;
  htmlDialogClass?: string;
  data?: IDialogData,
  hostComponent?: Component;
}