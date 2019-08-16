import {FormControl} from '@angular/forms';
import {Utils} from './Utils';

export class ValidacaoGenericaWCorrea {

    public static validarCPF(input: FormControl): any {
        return Utils.validarCPF(input.value) ? null : {CPF_Invalido: true};
    }

    public static validarCNPJ(input: FormControl): any {
        return Utils.validarCNPJ(input.value) ? null : {CNPJ_Invalido: true};
    }
}
