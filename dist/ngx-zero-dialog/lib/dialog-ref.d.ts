import { DialogResult } from './models/dialog-result.type';
/**
 * A reference to a dialog, providing methods to control its lifecycle and observe its closure.
 *
 * @export
 * @class DialogRef
 * @template Result The type of the result returned by the dialog when it is closed.
 */
export declare class DialogRef<Result = unknown> {
    #private;
    readonly nativeDialog: HTMLDialogElement;
    readonly animated?: boolean | undefined;
    /**
     * Observable that emits the result of the dialog when it is closed.
     * Consumers can subscribe to this observable to react to dialog closure.
     *
     * @readonly
     * @type {Observable<DialogResult<Result>>}
     */
    readonly closed$: import("rxjs").Observable<DialogResult<Result>>;
    constructor(nativeDialog: HTMLDialogElement, animated?: boolean | undefined);
    /**
     * Closes the dialog and optionally emits a result.
     * If animations are enabled, the dialog waits for the transition to complete before fully closing.
     *
     * @param {DialogResult<Result>} [value] Optional result to emit upon closure.
     */
    close(value?: DialogResult<Result>): void;
}
