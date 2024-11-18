# ngx-zero-dialog

A lightweight Angular library for managing dialogs using the native `<dialog>` API. With `ngx-zero-dialog`, you can create dynamic, accessible, and customizable dialogs in your Angular applications.  
> ⚠️ Requires Angular 16 or newer!

[LIVE DEMO](https://ko1ebayev.github.io/ngx-zero-dialog/)

## Installation and set-up

1. Install in application:
```bash
yarn add ngx-zero-dialog
```
2. place dialog container in your root component template  
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
 - the target view intself, it could be a `Component` or a `TemplateRef`

**Stacking context or z-index problems:**  
HTML dialog has a greate advantage in staking contexts management. Each dialog lives in its own "layer", so each dialog and its child views will never intersect each other, no matter what z-index is provided or how nodes are positioned.

**Host component approach**:  
`openDialog()` has required `host` parameter, its just a component with content insertion point in template - `<ng-template dialogContent></ng-template>` where target content will be rendered.  

Ngx-zero-dialog exports `NgxZeroDialogHost` class as a base class for host components to extend it.   

Host components make it easier to maintain dialogs with common layout across big application. The good way to utilize this is to create one service per host

**You need only css for enter/leave animations**  
Ngx-zero-dialog uses transition animations by attaching corresponding classes for hidden and visible states, take a look at built-in simple animation:  
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
As `openDialog` returns observable - dialog will be opened only when observable is subscribed  


## IDialogConfig interface
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

## IDialogData and IHostData interfaces
Both interface allows passing custom data to the dialog's content or host, data should be object and can contain whatever you want.  
```typescript
export type DialogData<D = Record<string, any>> = D;
```
When rendering view and attaching it to angulars angular's tree, `NgxZeroDialog` provides a `DIALOG_DATA` token in your target view and `HOST_DATA` in your host component, it can be accessed by injecting those in component:
```typescript
  @Component({...})
  export class MyDialog {
    readonly dialogData = inject<DataYouExpect>(DIALOG_DATA);
  }
```  
Data is an empty object `{}` by default if not provided.

## Host component
Each host component should extend `NgxZeroDialogHost<T>` base class, where `T` is type of `HOST_DATA` you expect to get. The `HOST_DATA` token is already inejcted in `NgxZeroDialogHost` you just need to call `super()`:  
There is two requirements for host component:  
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
All host components, as well as target components or templates comes with injected `DIALOG_REF` token. `DialogRef` class gives a control over dialog lifecycle from within the host or a target view:  
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
Provided value will be emitted in subscription after closing. `DialogResult` is a union type `Result | undefined`, `undefined` is emitted as a default value on close.  

`DIALOG_REF` is supposed to perform some host-specific logic, for example closing dialog on button click:
```typescript
@Component({ ... })
export class AlertDialogComponent (or dialog host) {
    readonly dialogRef = inject<boolean>(DIALOG_REF);

    close(result: boolean) {
      this.dialogRef.close(result);
    }
}
```
As mentioned before, `DIALOG_REF` is already injected in `NgxZeroDialogHost` class, like a `HOST_DATA`  



# Let's start building!  
## I recommended to explore demo page with code examples as it demonstrates how each dialog reflects in DOM - [link](https://ko1ebayev.github.io/ngx-zero-dialog/)
Now you are ready to use ngx-zero-dialog!   

Feel free to open discussions, issues or reach me out on Telegram or via e-mail