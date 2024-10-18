import { InjectionToken } from "@angular/core";
import { DialogData } from "../interfaces/dialog-data.interface";

export const NGX_DIALOG_DATA = new InjectionToken<DialogData>('DIALOG_DATA');