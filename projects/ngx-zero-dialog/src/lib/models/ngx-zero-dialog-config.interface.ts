import { Component } from './component.interface';

export interface INgxZeroDialogConfig {
  // container node to place dialogs
  containerNodeID: string;

  // overwrite default host component
  defaultHostComponent?: Component;

  // additional class attached to each <dialog> node
  htmlDialogClass?: string;

  // enable or disable animations completely
  enableAnimations?: boolean;
}
