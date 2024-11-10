import { InjectionToken } from '@angular/core';
import { IHostData } from '../models/host-data.interface';

export const HOST_DATA = new InjectionToken<IHostData>('HOST_DATA');
