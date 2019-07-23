import {FormControl} from '@angular/forms';
import {AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';

@Component({
    selector: 'app-message',
    template: `
        <span *ngIf="temErro() && control.hasError('required')">Preenchimento obrigatório!</span>
        <span *ngIf="temErro() && control.hasError('minlength')">Quantidade deve ser maior igual a {{control.errors['minlength']['requiredLength']}} caracter(es)</span>
        <span *ngIf="temErro() && control.hasError('maxlength')">Quantidade deve ser menor igual a {{control.errors['maxlength']['requiredLength']}} caracter(es)</span>
        <span *ngIf="temErro() && control.hasError('pattern')">Conteúdo inválido</span>
        <span *ngIf="temErro() && control.hasError('min')">Valor mínimo de {{control.errors['min']['min']}}</span>
        <span *ngIf="temErro() && control.hasError('max')">Valor máximo de {{control.errors['max']['max']}}</span>
        <span *ngIf="temErro() && control.hasError('email')">E-mail inválido</span>
    `,
    styles: [`

    `]
})

export class MessageComponent implements AfterViewChecked, AfterContentChecked, AfterViewInit {

    @Input() control: FormControl;
    // @Input() form: any;
    @Input() label: string;

    constructor(private cdr: ChangeDetectorRef) {
    }

    temErro(): boolean {
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
