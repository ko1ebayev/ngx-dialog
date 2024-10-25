import { InjectionToken } from "@angular/core";
import { DialogData } from "../models/dialog-data.interface";

export const NGX_DIALOG_DATA = new InjectionToken<DialogData>('DIALOG_DATA');
