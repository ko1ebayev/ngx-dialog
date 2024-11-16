import { Subject } from 'rxjs';
import { DialogResult } from './models/dialog-result.type';

export class DialogRef<Result = unknown> {
  readonly #_closed$ = new Subject<DialogResult<Result>>();

  readonly closed$ = this.#_closed$.asObservable();

  constructor(
    readonly nativeDialog: HTMLDialogElement,
    readonly animated?: boolean
  ) {}

  close(value?: DialogResult<Result>) {
    if (this.animated) {
      this.#terminateAnimatedDialog(value);
    } else {
      this.#terminateDialog(value);
    }
  }

  #terminateAnimatedDialog(value?: DialogResult<Result>) {
    this.nativeDialog.classList.remove('ngx-zero-dialog-visible');
    this.nativeDialog.addEventListener(
      'transitionend',
      () => {
        this.#terminateDialog(value);
      },
      { once: true }
    );
  }

  #terminateDialog(value?: DialogResult<Result>) {
    this.nativeDialog.close();
    this.#_closed$.next(value);
  }
}
