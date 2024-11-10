import { Subject } from 'rxjs';
import { DialogResult } from './types/dialog-result.type';

export class DialogRef<T = unknown> {
  readonly #_closed$ = new Subject<DialogResult<T>>();

  readonly closed$ = this.#_closed$.asObservable();

  constructor(
    readonly nativeDialog: HTMLDialogElement,
    readonly dialogID: string,
    readonly animated?: boolean
  ) {}

  close(value?: DialogResult<T>) {
    if (this.animated) {
      this.#terminateAnimatedDialog(value);
    } else {
      this.#terminateDialog(value);
    }
  }

  #terminateAnimatedDialog(value?: DialogResult<T>) {
    this.nativeDialog.classList.remove('ngx-zero-dialog-visible');
    this.nativeDialog.addEventListener(
      'transitionend',
      () => {
        this.#terminateDialog(value);
      },
      { once: true }
    );
  }

  #terminateDialog(value?: DialogResult<T>) {
    this.nativeDialog.close();
    this.#_closed$.next(value);
  }
}
