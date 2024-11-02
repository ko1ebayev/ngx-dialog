import { InjectionToken } from "@angular/core";
import { IDialogConfig } from "../models/dialog-config.interface";

export const DIALOG_CONFIG = new InjectionToken<IDialogConfig>('DIALOG_CONFIG');
