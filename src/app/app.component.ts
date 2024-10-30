import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppDialogService } from './app-dialog.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngx-dialog-app';
  constructor(private readonly appDialogService: AppDialogService) {}

  openDialogOne() {
    this.appDialogService.openDialogOne().subscribe((result) => {
      alert(`Result is ${result}`);
    });
  }

  openDialogTwo(template: TemplateRef<unknown>) {
    this.appDialogService.open(template).subscribe((result) => {
      alert(`Result is ${result}`);
    });
  }
}
