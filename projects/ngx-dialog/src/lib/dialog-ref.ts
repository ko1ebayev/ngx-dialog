import { Subject } from 'rxjs';

export class DialogRef<Result = unknown> {
  readonly _closed$ = new Subject<Result>();
  readonly closed$ = this._closed$.asObservable();

  constructor(private readonly nativeDialog: HTMLDialogElement) {}

  close(value: Result) {
    this.nativeDialog.close();
    this._closed$.next(value);
  }
}
