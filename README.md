# ngx-zero-dialog

A lightweight Angular library for managing dialogs using the native `<dialog>` API. With `ngx-zero-dialog`, you can create dynamic, accessible, and customizable dialogs in your Angular applications.  
> ⚠️ Requires Angular 16 or newer!

## Installation and set-up

1. Install via NPM:
```bash
npm install ngx-zero-dialog
```
or YARN:
```bash
yarn add ngx-zero-dialog
```
2. Next, place dialog container in your root component template  
```html
<div id="ngx-dialog-host"></div>
```
3. Provide Configuration
   ```typescript
import { provideNgxDialog } from 'ngx-dialog';

@NgModule({
  providers: [
    // other providers
    provideNgxDialog({ hostID: 'ngx-dialog-host' }),
  ],
})
export class AppModule {}
```

Now you’re ready to use the dialog service to open dialogs in your app.

## NgxDialogService
The ```NgxDialogService``` provides a simple API to open dialogs. The primary method is:
```typescript
openDialog<Result>(
  componentOrTemplate: Component | TemplateRef,
  config?: IDialogConfig,
): Observable<Result>;
```

## DialogConfig Interface
The DialogConfig interface allows you to customize dialog behavior and appearance.
```typescript
export interface DialogConfig {
  closeOnBackdropClick: boolean;  // Close dialog on backdrop click
  htmlDialogClass: string;        // Additional CSS classes for the dialog
}
```

## DialogData Interface
The DialogData interface allows passing custom data to the dialog.
```typescript
export type DialogData<D = Record<string, any>> = D;
```

## Usage Examples
Here’s how to use dialogService with different configurations:
### Example 1: Open a Dialog with Just a Component
```typescript
import { MyDialogComponent } from './my-dialog.component';

this.dialogService.openDialog(MyDialogComponent).subscribe(result => {
  console.log('Dialog result:', result);
});
```
### Example 2: Open a Dialog with a Component and Configuration
```typescript
import { MyDialogComponent } from './my-dialog.component';

const config: DialogConfig = { closeOnBackdropClick: true, htmlDialogClass: 'my-dialog-class' };

this.dialogService.openDialog(MyDialogComponent, config).subscribe(result => {
  console.log('Dialog result:', result);
});
```
### Example 3: Open a Dialog with a Component, Configuration, and Data
```typescript
import { MyDialogComponent } from './my-dialog.component';

const config: DialogConfig = { closeOnBackdropClick: true, htmlDialogClass: 'my-dialog-class' };
const data: DialogData = { title: 'My Custom Dialog', content: 'This is the dialog content.' };

this.dialogService.openDialog(MyDialogComponent, config, data).subscribe(result => {
  console.log('Dialog result:', result);
});
```

