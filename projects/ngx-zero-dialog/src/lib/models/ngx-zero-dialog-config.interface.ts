/**
 * Configuration options for the NgxZeroDialog.
 *
 * @export
 * @interface INgxZeroDialogConfig
 */
export interface INgxZeroDialogConfig {
  /**
   * The ID of the container DOM element where dialogs will be appended.
   * This element must exist in the root component's template for dialogs to function properly.
   *
   * @type {string}
   */
  containerNodeID: string;

  /**
   * Determines whether animations are globally enabled or disabled for dialogs.
   * If omitted, animations are enabled buy default
   *
   * @type {boolean | undefined}
   * @optional
   */
  enableAnimations?: boolean;
}
