import { Subject } from 'rxjs';
/**
 * A reference to a dialog, providing methods to control its lifecycle and observe its closure.
 *
 * @export
 * @class DialogRef
 * @template Result The type of the result returned by the dialog when it is closed.
 */
export class DialogRef {
    nativeDialog;
    animated;
    /**
     * Subject that emits the result of the dialog when it is closed.
     * @private
     */
    #_closed$ = new Subject();
    /**
     * Observable that emits the result of the dialog when it is closed.
     * Consumers can subscribe to this observable to react to dialog closure.
     *
     * @readonly
     * @type {Observable<DialogResult<Result>>}
     */
    closed$ = this.#_closed$.asObservable();
    constructor(nativeDialog, animated) {
        this.nativeDialog = nativeDialog;
        this.animated = animated;
    }
    /**
     * Closes the dialog and optionally emits a result.
     * If animations are enabled, the dialog waits for the transition to complete before fully closing.
     *
     * @param {DialogResult<Result>} [value] Optional result to emit upon closure.
     */
    close(value) {
        if (this.animated) {
            this.#terminateAnimatedDialog(value);
        }
        else {
            this.#terminateDialog(value);
        }
    }
    /**
     * Handles the termination of the dialog with animations.
     * It waits for the transition to complete before closing the dialog and emitting the result.
     *
     * @private
     * @param {DialogResult<Result>} [value] Optional result to emit upon closure.
     */
    #terminateAnimatedDialog(value) {
        if (this.animated) {
            this.nativeDialog.classList.remove('ngx-zero-dialog-visible');
            this.nativeDialog.addEventListener('transitionend', () => {
                this.#terminateDialog(value);
            }, { once: true });
        }
        else {
            this.#terminateDialog(value);
        }
    }
    /**
     * Handles the termination of the dialog, closing the native dialog element
     * and emitting the result through the `closed$` observable.
     *
     * @private
     * @param {DialogResult<Result>} [value] Optional result to emit upon closure.
     */
    #terminateDialog(value) {
        this.nativeDialog.close();
        this.#_closed$.next(value);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC16ZXJvLWRpYWxvZy9zcmMvbGliL2RpYWxvZy1yZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUcvQjs7Ozs7O0dBTUc7QUFDSCxNQUFNLE9BQU8sU0FBUztJQWlCVDtJQUNBO0lBakJYOzs7T0FHRztJQUNNLFNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBd0IsQ0FBQztJQUV6RDs7Ozs7O09BTUc7SUFDTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUVqRCxZQUNXLFlBQStCLEVBQy9CLFFBQWtCO1FBRGxCLGlCQUFZLEdBQVosWUFBWSxDQUFtQjtRQUMvQixhQUFRLEdBQVIsUUFBUSxDQUFVO0lBQzFCLENBQUM7SUFFSjs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxLQUE0QjtRQUNoQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCx3QkFBd0IsQ0FBQyxLQUE0QjtRQUNuRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUNoQyxlQUFlLEVBQ2YsR0FBRyxFQUFFO2dCQUNILElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixDQUFDLEVBQ0QsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQ2YsQ0FBQztRQUNKLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUM7SUFDSCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsZ0JBQWdCLENBQUMsS0FBNEI7UUFDM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBEaWFsb2dSZXN1bHQgfSBmcm9tICcuL21vZGVscy9kaWFsb2ctcmVzdWx0LnR5cGUnO1xuXG4vKipcbiAqIEEgcmVmZXJlbmNlIHRvIGEgZGlhbG9nLCBwcm92aWRpbmcgbWV0aG9kcyB0byBjb250cm9sIGl0cyBsaWZlY3ljbGUgYW5kIG9ic2VydmUgaXRzIGNsb3N1cmUuXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIERpYWxvZ1JlZlxuICogQHRlbXBsYXRlIFJlc3VsdCBUaGUgdHlwZSBvZiB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkaWFsb2cgd2hlbiBpdCBpcyBjbG9zZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBEaWFsb2dSZWY8UmVzdWx0ID0gdW5rbm93bj4ge1xuICAvKipcbiAgICogU3ViamVjdCB0aGF0IGVtaXRzIHRoZSByZXN1bHQgb2YgdGhlIGRpYWxvZyB3aGVuIGl0IGlzIGNsb3NlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlYWRvbmx5ICNfY2xvc2VkJCA9IG5ldyBTdWJqZWN0PERpYWxvZ1Jlc3VsdDxSZXN1bHQ+PigpO1xuXG4gIC8qKlxuICAgKiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIHJlc3VsdCBvZiB0aGUgZGlhbG9nIHdoZW4gaXQgaXMgY2xvc2VkLlxuICAgKiBDb25zdW1lcnMgY2FuIHN1YnNjcmliZSB0byB0aGlzIG9ic2VydmFibGUgdG8gcmVhY3QgdG8gZGlhbG9nIGNsb3N1cmUuXG4gICAqXG4gICAqIEByZWFkb25seVxuICAgKiBAdHlwZSB7T2JzZXJ2YWJsZTxEaWFsb2dSZXN1bHQ8UmVzdWx0Pj59XG4gICAqL1xuICByZWFkb25seSBjbG9zZWQkID0gdGhpcy4jX2Nsb3NlZCQuYXNPYnNlcnZhYmxlKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgbmF0aXZlRGlhbG9nOiBIVE1MRGlhbG9nRWxlbWVudCxcbiAgICByZWFkb25seSBhbmltYXRlZD86IGJvb2xlYW5cbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGRpYWxvZyBhbmQgb3B0aW9uYWxseSBlbWl0cyBhIHJlc3VsdC5cbiAgICogSWYgYW5pbWF0aW9ucyBhcmUgZW5hYmxlZCwgdGhlIGRpYWxvZyB3YWl0cyBmb3IgdGhlIHRyYW5zaXRpb24gdG8gY29tcGxldGUgYmVmb3JlIGZ1bGx5IGNsb3NpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7RGlhbG9nUmVzdWx0PFJlc3VsdD59IFt2YWx1ZV0gT3B0aW9uYWwgcmVzdWx0IHRvIGVtaXQgdXBvbiBjbG9zdXJlLlxuICAgKi9cbiAgY2xvc2UodmFsdWU/OiBEaWFsb2dSZXN1bHQ8UmVzdWx0Pikge1xuICAgIGlmICh0aGlzLmFuaW1hdGVkKSB7XG4gICAgICB0aGlzLiN0ZXJtaW5hdGVBbmltYXRlZERpYWxvZyh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuI3Rlcm1pbmF0ZURpYWxvZyh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIHRlcm1pbmF0aW9uIG9mIHRoZSBkaWFsb2cgd2l0aCBhbmltYXRpb25zLlxuICAgKiBJdCB3YWl0cyBmb3IgdGhlIHRyYW5zaXRpb24gdG8gY29tcGxldGUgYmVmb3JlIGNsb3NpbmcgdGhlIGRpYWxvZyBhbmQgZW1pdHRpbmcgdGhlIHJlc3VsdC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtEaWFsb2dSZXN1bHQ8UmVzdWx0Pn0gW3ZhbHVlXSBPcHRpb25hbCByZXN1bHQgdG8gZW1pdCB1cG9uIGNsb3N1cmUuXG4gICAqL1xuICAjdGVybWluYXRlQW5pbWF0ZWREaWFsb2codmFsdWU/OiBEaWFsb2dSZXN1bHQ8UmVzdWx0Pikge1xuICAgIGlmICh0aGlzLmFuaW1hdGVkKSB7XG4gICAgICB0aGlzLm5hdGl2ZURpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCduZ3gtemVyby1kaWFsb2ctdmlzaWJsZScpO1xuICAgICAgdGhpcy5uYXRpdmVEaWFsb2cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgdGhpcy4jdGVybWluYXRlRGlhbG9nKHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgeyBvbmNlOiB0cnVlIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuI3Rlcm1pbmF0ZURpYWxvZyh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIHRlcm1pbmF0aW9uIG9mIHRoZSBkaWFsb2csIGNsb3NpbmcgdGhlIG5hdGl2ZSBkaWFsb2cgZWxlbWVudFxuICAgKiBhbmQgZW1pdHRpbmcgdGhlIHJlc3VsdCB0aHJvdWdoIHRoZSBgY2xvc2VkJGAgb2JzZXJ2YWJsZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtEaWFsb2dSZXN1bHQ8UmVzdWx0Pn0gW3ZhbHVlXSBPcHRpb25hbCByZXN1bHQgdG8gZW1pdCB1cG9uIGNsb3N1cmUuXG4gICAqL1xuICAjdGVybWluYXRlRGlhbG9nKHZhbHVlPzogRGlhbG9nUmVzdWx0PFJlc3VsdD4pIHtcbiAgICB0aGlzLm5hdGl2ZURpYWxvZy5jbG9zZSgpO1xuICAgIHRoaXMuI19jbG9zZWQkLm5leHQodmFsdWUpO1xuICB9XG59XG4iXX0=