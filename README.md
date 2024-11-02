# Ngx Dialog

A simple Angular dialog solution implemented using the native HTML `<dialog>` API. No overlays, no portals, and no bloat in bundle size.  
**Requires Angular 17 or newer.**

TODO  
- customizable enter/leave animations
- wrap whole openDialog code in rxjs.defer
- host component params
- finish demo page

## Installation

Install via NPM:
```bash
npm install ngx-dialog
```
or via YARN:
```bash
yarn add ngx-dialog
```

## Setup with Your Application
1) Place the Dialog Host Container
Add a container for the dialog host in your root app.component.html file:
```html
<div id="ngx-dialog-host"></div>
```
2) Provide Configuration
Register the dialog provider with configuration in app.module.ts or app.config.ts:
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
3) Show Dialogs!
Now you’re ready to use the dialog service to open dialogs in your app.

## NgxDialogService
The ```NgxDialogService``` provides a simple API to open dialogs. The primary method is:
```typescript
openDialog<Result>(
  component: ComponentType<unknown>,
  config?: DialogConfig,
  data?: DialogData
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

