import {AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Utils} from '../../utils/Utils';

@Component({
    selector: 'app-imagem-base64-dialog',
    templateUrl: './imagem-base64-dialog.component.html',
    styleUrls: ['./imagem-base64-dialog.component.scss']
})
export class ImagemBase64DialogComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked, OnDestroy {

    carregandoDados = false;

    imageChangedEvent: any = '';
    croppedImage: any = '';
    showCropper = false;

    imagemSelecionada = false;
    imagemCameraAberta = false;

    localstreamCamera: any;

    @ViewChild(ImageCropperComponent, {static: false}) imageCropper: ImageCropperComponent;

    // @ViewChild('webCamera', {static: false}) webCamera: ElementRef;

    constructor(
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any) {

    }


    ngOnInit(): void {
        // console.log('IMAGEM DA FONTE: ', this.data.imagem);
    }

    ngOnDestroy(): void {
        this.pararStreamDaCamera();
    }

    ngAfterViewInit(): void {
        if (this.data.imagem) {
            this.imageCropper.imageFile = Utils.converterImagemBase64EmFile(this.data.imagem);
            this.imagemSelecionada = true;
            this.croppedImage = '';
            this.showCropper = false;

            this.cdr.detectChanges();
        }
    }

    ngAfterViewChecked(): void {
        this.cdr.detectChanges();
    }

    ngAfterContentChecked(): void {
        this.cdr.detectChanges();
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

    // https://velhobit.com.br/programacao/como-tirar-uma-foto-usando-a-webcam-javascript-html.html
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

        // navigator.getUserMedia = (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Verifica se o navegador pode capturar mídia
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: 'user'}})
            // navigator.mediaDevices.getUserMedia({audio: false, video: true})
            // navigator.mediaDevices.getUserMedia({audio: false, video: { facingMode: { exact: "environment" } }})

                .then(stream => {

                    // Usado para fechar o stream depois
                    this.localstreamCamera = stream;

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
        } else {
            this.carregandoDados = false;
            this.imagemCameraAberta = false;

            this.imagemSelecionada = false;
            this.croppedImage = '';
            this.showCropper = false;

            alert('Oooopps... Falhou : \'(');
        }


        // navigator['getMedia'] = ( navigator.getUserMedia ||
        //     navigator['webkitGetUserMedia'] ||
        //     navigator['mozGetUserMedia'] ||
        //     navigator['msGetUserMedia']);
        //
        // navigator['getMedia'] (
        //
        //     // permissoes
        //     {
        //         video: true,
        //         audio: false
        //     },
        //
        //     // callbackSucesso
        //     localMediaStream => {
        //         const video = document.querySelector('video');
        //         video.src = window.URL.createObjectURL(localMediaStream);
        //         video.onloadedmetadata = (e) => {
        //             console.log('ENTROU AQUI 1');
        //         };
        //     },
        //
        //     // callbackErro
        //     err => {
        //         console.log("O seguinte erro ocorreu: " + err);
        //     }
        //
        // );
    }

    tirarFotoWebCamera(): void {
        // Captura elemento de vídeo
        const video = document.querySelector('#webCamera');

        // Criando um canvas que vai guardar a imagem temporariamente
        const canvas = document.createElement('canvas');
        canvas.width = video['videoWidth'];
        canvas.height = video['videoHeight'];

        const ctx = canvas.getContext('2d');

        // Desenhando e convertendo as dimensões
        // @ts-ignore
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        this.mirrorImage(ctx, canvas, 0, 0, true, false); // horizontal mirror
        // this.mirrorImage(ctx, canvas, 0, 0, false, true); // vertical mirror
        // this.mirrorImage(ctx, canvas, 0, 0, true, true);  // horizontal and vertical mirror


        // Criando o JPG
        const imbBase64 = canvas.toDataURL('image/png'); // O resultado é um BASE64 de uma imagem.

        this.imagemCameraAberta = false;

        // Colocando a imagem dentro do cropper
        this.imageCropper.imageFile = Utils.converterImagemBase64EmFile(imbBase64);
        this.imagemSelecionada = true;
        this.croppedImage = '';
        this.showCropper = false;

        this.pararStreamDaCamera();
        this.cdr.detectChanges();
    }

    pararStreamDaCamera(): void {
        if (this.localstreamCamera) {
            this.localstreamCamera.getTracks().forEach(track => track.stop());
            this.localstreamCamera = null;
        }
    }

    // https://stackoverflow.com/questions/3129099/how-to-flip-images-horizontally-with-html5
    mirrorImage(ctx, image, x = 0, y = 0, horizontal, vertical): any {
        ctx.save();  // save the current canvas state
        ctx.setTransform(
            horizontal ? -1 : 1, 0, // set the direction of x axis
            0, vertical ? -1 : 1,   // set the direction of y axis
            x + horizontal ? image.width : 0, // set the x origin
            y + vertical ? image.height : 0   // set the y origin
        );
        ctx.drawImage(image, 0, 0);
        ctx.restore(); // restore the state as it was when this function was called
    }

}
