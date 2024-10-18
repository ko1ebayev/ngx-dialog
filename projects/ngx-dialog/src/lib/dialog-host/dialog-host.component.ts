import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgxDialogContentDirective } from './dialog-content.directive';

@Component({
  standalone: true,
  selector: 'ngx-dialog-host',
  templateUrl: 'dialog-host.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxDialogContentDirective],
})
export class NgxDialogHostComponent implements OnInit {
  @ViewChild(NgxDialogContentDirective, { static: false })
  contentInsertionPoint!: NgxDialogContentDirective;

  nativeDialogRef!: HTMLDialogElement;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    console.log(this.contentInsertionPoint);
    this.nativeDialogRef.addEventListener('close', (event) => {
      this.contentInsertionPoint.viewContainerRef.clear();
    });
  }
}
