# Ngx Dialog

Simple Angular dialog solution implemented using native HTML dialog API. No overlays, no portals and no bloat in bundle size.  
Requires Angular 17 or newer.

## Installation

Via NPM ```npm install ngx-dialog```  
Via Yarn ```yarn add ngx-dialog```

## Setup with your application

1) Place dialog host container in your root app.component.ts:
``` <div id="ngx-dialog-host"></div> ```

2) Provide configuration in app.module.ts or in app.config.ts 

```providers: [
    ...
    provideNgxDialog({ hostID: 'ngx-dialog-host' }),
]```

3) Show dialogs!

## Dialog service  
Dialog service has one public method to show dialogs  
```dialogService.openDialog(component, config, data)```
