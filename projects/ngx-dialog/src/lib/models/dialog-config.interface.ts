import { ComponentType } from "./component-type.interface";
import { DialogData } from "./dialog-data.interface";

export interface DialogConfig {
  closeOnBackdropClick?: boolean;
  htmlDialogClass?: string;
  data?: DialogData,
  hostComponent?: ComponentType<any>
}