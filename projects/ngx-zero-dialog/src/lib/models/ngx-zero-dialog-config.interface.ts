import { Component } from './component.interface';

export interface INgxZeroDialogConfig {
  // ngx zero dialog container node
  containerNodeID: string;

  // default fall-back host component
  defaultHostComponent?: Component;

  // additional class attached to each <dialog> node
  htmlDialogClass?: string;
}
