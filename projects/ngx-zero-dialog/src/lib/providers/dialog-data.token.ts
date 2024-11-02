import { InjectionToken } from "@angular/core";
import { IDialogData } from "../models/dialog-data.interface";

export const DIALOG_DATA = new InjectionToken<IDialogData>('DIALOG_DATA');
