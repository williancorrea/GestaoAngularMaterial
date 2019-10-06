import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-imagem-base64',
    templateUrl: './imagem-base64.component.html',
    styleUrls: ['./imagem-base64.component.scss']
})
export class ImagemBase64Component implements OnInit {

    @Input() imagemBase64: string;
    @Output() imagemBase64Change: string; // Two-way binding - TEM SER ASSIM

    constructor() {
    }

    ngOnInit(): void {
    }

    abrirModalTrocarImagem(): void{
        console.log('Vai Abrir o dialog');
    }

    imagemBase64Alterado(): any {
        // this.imagemBase64.setValue('');
        // this.imagemBase64.emit(this.erro);
    }

}
