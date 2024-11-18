# ngx-zero-dialog

A lightweight Angular library for managing dialogs using the native `<dialog>` API. With `ngx-zero-dialog`, you can create dynamic, accessible, and customizable dialogs in your Angular applications.  
> ⚠️ Requires Angular 16 or newer!

[LIVE DEMO](https://ko1ebayev.github.io/ngx-zero-dialog/)

## Installation and set-up

1. Install in application:
```bash
yarn add ngx-zero-dialog
```
2. Place dialog container in your root component template  
```html
<div id="ngx-dialog-host"></div>
```
3. Provide Configuration
```typescript
import { provideNgxZeroDialog } from 'ngx-zero-dialog';

@NgModule({
  providers: [
    // other providers
    provideNgxZeroDialog({ hostID: 'ngx-dialog-host' }),
  ],
})
export class AppModule {}
```

## Key points behind ngx-zero-dialog  

**Each dialog consist of three elements:**
 - native `<dialog>` element
 - host component with <ng-tempate> placeholder to insert target view
 - the target view itself, it could be a `Component` or a `TemplateRef`

**Stacking context or z-index problems:**  
"HTML dialogs offer a great advantage in managing stacked contexts. Each dialog exists in its own 'layer,' ensuring that dialogs and their child views never intersect, regardless of the z-index or how nodes are positioned.

**Host component approach**:  
`openDialog()` requires a `host` parameter, which is simply a component containing a content insertion point in its template: `<ng-template dialogContent></ng-template>`. This is where the target content will be rendered.

ngx-zero-dialog exports `NgxZeroDialogHost` class as a base class for host components to extend it.   

Host components simplify maintaining dialogs with a common layout across large applications. A good approach is to create a dedicated service for each host.

**You need only css for enter/leave animations**  
Ngx-zero-dialog supports transition animations by applying specific classes for hidden and visible states. Here's an example of the built-in simple animation:  
```css
dialog.ngx-zero-dialog-hidden {
  opacity: 0;
  transition: all 0.2s ease-in-out;

  &::backdrop {
    opacity: 0;
    transition: all 0.2s ease-in-out;
  }
}

dialog.ngx-zero-dialog-visible {
  opacity: 1;

  &::backdrop {
    opacity: 1;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(5px);
  }
}
```


# API Breakdown

## NgxZeroDialogService
The `NgxDialogService` provides a simple API to open dialogs, just one public method:
```typescript
export class NgxZeroDialogService {
    openDialog<T>(
      componentOrTemplate: Component | TemplateRef,
      config: IDialogConfig,
    ): Observable<DialogResult<T>>;
}
```  
Since `openDialog()` returns an observable, the dialog will only open when the observable is subscribed to.


## `IDialogConfig` interface
```typescript
export interface IDialogConfig {
  /**
   * Determines whether the dialog should close when the user clicks outside the dialog (on the backdrop).
   *
   * Defaults to `true` if not specified.
   */
  closeOnBackdropClick?: boolean;

  /**
   * The host component that acts as the container for the dialog content.
   * This component is responsible for rendering the dialog and its layout.
   */
  hostComponent: Component;

  /**
   * Data specific to the host component, allowing customization of the host's behavior or appearance.
   * This data is injected into the host component at runtime.
   */
  hostData?: IHostData;

  /**
   * A CSS class or list of classes to be added to the root `<dialog>` element.
   * This can be used to customize the dialog's appearance.
   */
  dialogNodeClass?: string;

  /**
   * Data to be passed to the dialog content component or template.
   * This data is injected into the dynamic content at runtime.
   */
  dialogData?: IDialogData;

  /**
   * Specifies whether the dialog should use animations for its appearance and disappearance.
   * If not specified, it may default to the global animation setting.
   *
   * Enabled by default
   */
  animated?: boolean;
}

```

## `IDialogData` and `IHostData` interfaces
Both interfaces allow passing custom data to the dialog's content or host. The data should be an object and can include any properties you need.
```typescript
export type DialogData = object;
```
When rendering a view and attaching it to Angular's component tree, NgxZeroDialog provides the `DIALOG_DATA` token in the target view and the `HOST_DATA` token in the host component. These tokens can be accessed by injecting them into the respective components:
```typescript
  @Component({...})
  export class MyDialog {
    readonly dialogData = inject<DataYouExpect>(DIALOG_DATA);
  }
```  
Data is an empty object `{}` by default if not provided.

## Host component
There are two requirements for the host component:
1. Host should extend `NgxZeroDialogHost<T>` base class, where `T` is type of `HOST_DATA` you expect to get. The `HOST_DATA` token is already inejcted in `NgxZeroDialogHost` you just need to call `super()`. 
2. Host component should import `DialogContent` directive which acts as a content insertion point for traget views and should exist in template: `<ng-template dialogContent></ng-template>`  
```typescript
@Component({
  standalone: true,
  selector: 'dialog-host',
  template: `<ng-template dialogContent></ng-template>`,
  imports: [DialogContentDirective, CommonModule],
})
export class DialogHostComponent extends NgxZeroDialogHost<HostDataYouExpect> {
  constructor() {
    super();
  }
}
```


## DialogRef
All host components, as well as target components or templates, include an injected `DIALOG_REF` token. The `DialogRef` class provides control over the dialog's lifecycle directly from within the host or the target view:
```typescript
export class DialogRef<Result> {
  /**
   * Closes the dialog and optionally emits a result.
   * If animations are enabled, the dialog waits for the transition to complete before fully closing.
   *
   * @param {DialogResult<Result>} [value] Optional result to emit upon closure.
   */
  close(value?: DialogResult<Result>): void
}
```  
The provided value will be emitted in the subscription upon closing. `DialogResult` is a union type `Result | undefined`, where undefined is emitted as the default value when the dialog is closed without a result.

`DIALOG_REF` is designed to handle host-specific logic, such as closing the dialog when a button is clicked. Here's an example of how you might use it:
```typescript
@Component({ ... })
export class AlertDialogComponent {
    readonly dialogRef = inject<boolean>(DIALOG_REF);

    close(result: boolean) {
      this.dialogRef.close(result);
    }
}
```
As mentioned before, `DIALOG_REF` is already injected in `NgxZeroDialogHost` class, like a `HOST_DATA`  



# Let's start building!  
## I recommend exploring the demo page with code examples, as it demonstrates how each dialog is reflected in the DOM. You can check it out here: [ngx-zero-dialog demo](https://ko1ebayev.github.io/ngx-zero-dialog/)

Feel free to open discussions, raise issues, or reach out to me on Telegram or via email. I'm happy to help!