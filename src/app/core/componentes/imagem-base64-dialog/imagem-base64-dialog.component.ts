import {Component, Inject, OnInit} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-imagem-base64-dialog',
    templateUrl: './imagem-base64-dialog.component.html',
    styleUrls: ['./imagem-base64-dialog.component.scss']
})
export class ImagemBase64DialogComponent implements OnInit {

    imageChangedEvent: any = '';
    croppedImage: any = '';
    showCropper = false;
    imagemSelecionada = false;


    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

    }

    ngOnInit(): void {
        // console.log('IMAGEM DA FONTE: ', this.data.imagem);
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

    // @ViewChild(ImageCropperComponent, {static: true}) imageCropper: ImageCropperComponent;

    // rotateLeft(): void {
    //     this.imageCropper.rotateLeft();
    // }
    //
    // rotateRight(): void {
    //     this.imageCropper.rotateRight();
    // }
    //
    // flipHorizontal(): void {
    //     this.imageCropper.flipHorizontal();
    // }
    //
    // flipVertical(): void {
    //     this.imageCropper.flipVertical();
    // }
    //
    // cortarImagem(): void {
    //     console.log('IMAGEM CORTADA', this.croppedImage);
    //     // this.form.controls['logo'].setValue(this.croppedImage);
    //     // this.mostrarDialogoLogo = false;
    // }

}
