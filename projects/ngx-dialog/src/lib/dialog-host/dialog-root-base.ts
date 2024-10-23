import {
    AfterViewInit,
    Directive,
    input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { NgxDialogContentDirective } from './dialog-content.directive';

@Directive()
export class DialogRootBase implements AfterViewInit, OnDestroy {
  @ViewChild(NgxDialogContentDirective, { static: true })
  contentInsertionPoint!: NgxDialogContentDirective;

  readonly nativeDialogRef = input.required<HTMLDialogElement>();

  ngAfterViewInit() {
    this.nativeDialogRef().addEventListener('close', () => {
      this.contentInsertionPoint.viewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    this.nativeDialogRef().removeEventListener('close', () => {
      this.contentInsertionPoint.viewContainerRef.clear();
    });
  }
}
