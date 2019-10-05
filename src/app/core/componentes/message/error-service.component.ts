import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-error-service-message',
    template: `

        <mat-card *ngIf="erro && erro.length > 0" style="margin-bottom: 10px;">
            <div class="example-container mat-elevation-z8 message-box ' + {{verificaTipoErro()}}  +'">
                <div [innerHTML]="erro"></div>
                <mat-icon class="caixinhaErro" (click)="$event.stopPropagation(); limparErro()">
                    add_circle_outline
                </mat-icon>
            </div>
        </mat-card>
    `,
    styles: [`
        .caixinhaErro {
            position: absolute;
            right: 30px;
            top: 30px;
            cursor: pointer;
            transform: rotate(45deg);
        }
    `]
})

export class ErrorServiceComponent {
    @Input() erro: string;
    @Output() erroChange: EventEmitter<string> = new EventEmitter<string>(); // Two-way binding - TEM SER ASSIM
    @Input() erroTipo: string;

    constructor() {
    }

    limparErro(): any {
        this.erro = '';
        this.erroChange.emit(this.erro);
    }

    verificaTipoErro(): string {
        if (this.erroTipo === 'info') {
            return 'info';
        } else if (this.erroTipo === 'error') {
            return 'error';
        } else if (this.erroTipo === 'success') {
            return 'success';
        } else if (this.erroTipo === 'warning') {
            return 'warning';
        }

        return '';
    }
}
