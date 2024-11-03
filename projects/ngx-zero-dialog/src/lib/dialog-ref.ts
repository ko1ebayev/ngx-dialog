import { Subject } from 'rxjs';
import { DialogResult } from './types/dialog-result.type';

export class DialogRef<T = unknown> {
  private readonly _closed$ = new Subject<DialogResult<T>>();
  readonly closed$ = this._closed$.asObservable();

  constructor(
    readonly nativeDialog: HTMLDialogElement,
    readonly dialogID: string
  ) {}

  close(value?: DialogResult<T>) {
    ///// WIP animations
    this.nativeDialog.classList.remove('ngx-zero-dialog-enter');
    setTimeout(() => {
      this.nativeDialog.classList.add('ngx-zero-dialog-leave');

      this.nativeDialog.addEventListener(
        'animationend',
        () => {
          this.nativeDialog.classList.remove('ngx-zero-dialog-leave');
          this.nativeDialog.close();
          this._closed$.next(value);
        },
        { once: true }
      );
    }, 0);
  }
}
