import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';

@Component({
    standalone: true,
    selector: 'app-code-snippet',
    templateUrl: 'code-snippet.component.html',
    styleUrl: 'code-snippet.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, Highlight]
})

export class CodeSnippetComponent implements OnInit {
    readonly code = input.required<string>();
    readonly language = input.required<'html' | 'javascript' | 'typescript'>();
    
    constructor() { }

    ngOnInit() { }
}