import {FormControl} from '@angular/forms';
import {Utils} from './Utils';

export class ValidacaoGenericaWCorrea {

    public static validarCPF(input: FormControl): any {
        return Utils.validarCPF(input.value) ? null : {CPF_Invalido: true};
    }

    public static validarCNPJ(input: FormControl): any {
        return Utils.validarCNPJ(input.value) ? null : {CNPJ_Invalido: true};
    }

    public static SelecionarItemCmb(input: FormControl): any {
        if (typeof input.value === 'string' || (input.value != null && input.value.length > 0)) {
            return {Selecionar_Item: true};
        }
        return null;
    }

    public static SelecionarItemObrigatorioCmb(input: FormControl): any {
        if (typeof input.value === 'string') {
            return {Selecionar_Item: true};
        }
        return null;
    }
}
