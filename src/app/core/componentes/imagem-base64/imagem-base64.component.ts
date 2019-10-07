import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ImagemBase64DialogComponent} from '../imagem-base64-dialog/imagem-base64-dialog.component';

@Component({
    selector: 'app-imagem-base64',
    templateUrl: './imagem-base64.component.html',
    styleUrls: ['./imagem-base64.component.scss']
})
export class ImagemBase64Component implements OnInit {

    @Input() disabled: boolean;
    @Input() imagemBase64: string;
    @Output() imagemBase64Change: EventEmitter<string> = new EventEmitter<string>();  // Two-way binding - TEM SER ASSIM

    constructor(public dialog: MatDialog) {

    }

    ngOnInit(): void {
    }

    abrirModalTrocarImagem(): void {
        const dialogRef = this.dialog.open(ImagemBase64DialogComponent,
            {autoFocus: false, data: {imagem: this.imagemBase64}}
            );

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.imagemBase64 = result;
                this.imagemBase64Change.emit(this.imagemBase64);
            }
        });
    }
}
