import { Subject } from 'rxjs';

export class DialogRef<Result = unknown> {
  private readonly _closed$ = new Subject<Result>();
  readonly closed$ = this._closed$.asObservable();

  constructor(
    readonly nativeDialog: HTMLDialogElement,
    readonly dialogID: string
  ) {}

  close(value: Result) {
    this.nativeDialog.close();
    this._closed$.next(value);
  }
}
