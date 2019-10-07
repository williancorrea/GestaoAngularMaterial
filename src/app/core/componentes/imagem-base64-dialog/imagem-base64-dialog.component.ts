import {AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Utils} from '../../utils/Utils';

@Component({
    selector: 'app-imagem-base64-dialog',
    templateUrl: './imagem-base64-dialog.component.html',
    styleUrls: ['./imagem-base64-dialog.component.scss']
})
export class ImagemBase64DialogComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked {

    carregandoDados = false;

    imageChangedEvent: any = '';
    croppedImage: any = '';
    showCropper = false;

    imagemSelecionada = false;
    tamanhoMinimodaImagem = false;
    imagemCameraAberta = false;

    @ViewChild(ImageCropperComponent, {static: false}) imageCropper: ImageCropperComponent;

    // @ViewChild('webCamera', {static: false}) webCamera: ElementRef;

    constructor(
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any) {

    }

    ngOnInit(): void {
        // console.log('IMAGEM DA FONTE: ', this.data.imagem);
    }

    ngAfterViewInit(): void {
        if (this.data.imagem) {
            this.imageCropper.imageFile = Utils.converterImagemBase64EmFile(this.data.imagem);
            this.imagemSelecionada = true;
            this.croppedImage = '';
            this.showCropper = false;

            this.verificarTamanhoMinimoDaImagem(this.data.imagem, 150);

            this.cdr.detectChanges();
        }
    }

    ngAfterViewChecked(): void {
        this.cdr.detectChanges();
    }

    ngAfterContentChecked(): void {
        this.cdr.detectChanges();
    }

    verificarTamanhoMinimoDaImagem(imagemBase64: string, tamanhoMinimo: number): void {
        const img = new Image();
        img.src = imagemBase64;

        if (img.width <= tamanhoMinimo || img.height <= tamanhoMinimo) {
            this.tamanhoMinimodaImagem = true;
        } else {
            this.tamanhoMinimodaImagem = false;
        }
    }

    fileChangeEvent(event: any): void {
        // VARIFICA SE FOI SELECIONADO ALGUMA IMAGEM
        const target = event.target || event.srcElement;
        if (target.value.length === 0) {
            this.imagemSelecionada = false;
            this.croppedImage = '';
            this.showCropper = false;
            return;
        }

        this.imageChangedEvent = event;
        this.imagemSelecionada = true;
        this.croppedImage = '';
        this.showCropper = false;

        this.verificarTamanhoMinimoDaImagem(this.imageCropper.imageBase64, 150);
    }

    imageCropped(event: ImageCroppedEvent): void {
        this.croppedImage = event.base64;
    }

    imageLoaded(): void {
        this.showCropper = true;
    }

    cropperReady(): void {
    }

    loadImageFailed(): void {
        this.imagemSelecionada = false;
    }

    rotateLeft(): void {
        this.imageCropper.rotateLeft();
    }

    rotateRight(): void {
        this.imageCropper.rotateRight();
    }

    flipHorizontal(): void {
        this.imageCropper.flipHorizontal();
    }

    flipVertical(): void {
        this.imageCropper.flipVertical();
    }

    carregarCamera(): void {
        this.imagemSelecionada = false;
        this.croppedImage = '';
        this.showCropper = false;

        this.imagemCameraAberta = true;

        this.carregandoDados = true;
        const video = document.querySelector('#webCamera');

        // As opções abaixo são necessárias para o funcionamento correto no iOS
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');

        // Verifica se o navegador pode capturar mídia
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: 'user'}})
                .then(stream => {
                    // Definir o elemento vídeo a carregar o capturado pela webcam
                    video['srcObject'] = stream;
                    this.carregandoDados = false;
                })
                .catch(error => {
                    this.carregandoDados = false;
                    this.imagemCameraAberta = false;

                    this.imagemSelecionada = false;
                    this.croppedImage = '';
                    this.showCropper = false;

                    alert('Oooopps... Falhou : \'(');
                });
        }
    }

    tirarFotoWebCamera(): void {
        // Captura elemento de vídeo
        const video = document.querySelector('#webCamera');

        // Criando um canvas que vai guardar a imagem temporariamente
        const canvas = document.createElement('canvas');
        canvas.width = video['videoWidth'];
        canvas.height = video['videoHeight'];

        const ctx = canvas.getContext('2d');
        // ctx.scale(-1, 1);

        // Desenhando e convertendo as dimensões
        // @ts-ignore
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Criando o JPG
        const imbBase64 = canvas.toDataURL('image/png'); // O resultado é um BASE64 de uma imagem.

        this.imagemCameraAberta = false;

        // Colocando a imagem dentro do cropper
        this.imageCropper.imageFile = Utils.converterImagemBase64EmFile(imbBase64);
        this.imagemSelecionada = true;
        this.croppedImage = '';
        this.showCropper = false;

        this.tamanhoMinimodaImagem = false;
        this.cdr.detectChanges();

        setTimeout(() => {
            this.flipHorizontal();
            this.cdr.detectChanges();
        }, 200);
    }
}
