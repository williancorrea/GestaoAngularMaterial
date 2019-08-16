import {FormControl} from '@angular/forms';
import {AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';

@Component({
    selector: 'app-message',
    template: `
        <span *ngIf="temErro() && (erroCodigo && erroCodigo === 'required')">Preenchimento obrigatório!</span>
        <span *ngIf="temErro() && (erroCodigo && erroCodigo === 'minlength')">Quantidade deve ser maior igual a {{control.errors['minlength']['requiredLength']}} caracter(es)</span>
        <span *ngIf="temErro() && (erroCodigo && erroCodigo === 'maxlength')">Quantidade deve ser menor igual a {{control.errors['maxlength']['requiredLength']}} caracter(es)</span>
        <span *ngIf="temErro() && (erroCodigo && erroCodigo === 'pattern')">Conteúdo inválido</span>
        <span *ngIf="temErro() && (erroCodigo && erroCodigo === 'min')">Valor mínimo de {{control.errors['min']['min']}}</span>
        <span *ngIf="temErro() && (erroCodigo && erroCodigo === 'max')">Valor máximo de {{control.errors['max']['max']}}</span>
        <span *ngIf="temErro() && (erroCodigo && erroCodigo === 'email')">E-mail inválido</span>
        <span *ngIf="temErro() && (erroCodigo && erroCodigo === 'Mask error')">Preenchimento incorreto</span>
        <span *ngIf="temErro() && (erroCodigo && erroCodigo === 'CPF_Invalido')">CPF Inválido</span>
        <span *ngIf="temErro() && (erroCodigo && erroCodigo === 'CNPJ_Invalido')">CNPJ Inválido</span>
    `,
    styles: [`

    `]
})

export class MessageComponent implements AfterViewChecked, AfterContentChecked, AfterViewInit {

    @Input() control: FormControl;
    // @Input() form: any;
    @Input() label: string;


    erroCodigo: any;
    erroMensagem: any;

    constructor(private cdr: ChangeDetectorRef) {
    }


    temErro(): boolean {
        if (this.control == null) {
            return false;
        }

        /**
         * RECUPERA A PILHA DE ERRROS DE UM DETERMINADO CAMPO E PEGA O PRIMEIRO ERRO DA PILHA PARA APRESENTAR PARA O USUARIO
         */
        if (this.control.errors != null) {
            this.erroCodigo = Object.keys(this.control.errors)[0].toString();
        }

        // if ((this.control.invalid && this.control.enabled && (this.control.dirty || this.control.touched)) || this.form.submitted) {
        // if ((this.control.invalid && this.control.enabled && (this.control.dirty || this.control.touched)) || (this.control.parent.invalid && this.control.parent.dirty)) {
        // if ((this.control.invalid && this.control.enabled && (this.control.dirty || this.control.touched))) {
        //     this.control.markAsDirty();
        //     this.control.markAsTouched();
        //     this.control.updateValueAndValidity();
        // }

        // console.log(this.control.errors);

        // return this.control.invalid && this.control.enabled && (this.control.dirty || this.control.touched || this.form.submitted);
        // return this.control.invalid && this.control.enabled && (this.control.dirty || this.control.touched || (this.control.parent.invalid && this.control.parent.dirty));
        // return this.control.invalid && this.control.enabled && (this.control.dirty || this.control.touched);
        return this.control.invalid && this.control.enabled;
    }

    ngAfterViewInit(): void {
        this.cdr.detectChanges();
    }

    ngAfterViewChecked(): void {
        this.cdr.detectChanges();
    }

    ngAfterContentChecked(): void {
        this.cdr.detectChanges();
    }

}
