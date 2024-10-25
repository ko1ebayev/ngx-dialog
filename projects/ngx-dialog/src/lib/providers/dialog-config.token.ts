import { InjectionToken } from "@angular/core";
import { DialogConfig } from "../models/dialog-config.interface";

export const NGX_DIALOG_CONFIG = new InjectionToken<DialogConfig>('DIALOG_CONFIG_TOKEN');
