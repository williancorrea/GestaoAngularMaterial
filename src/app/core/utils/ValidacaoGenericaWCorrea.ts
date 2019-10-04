import {AbstractControl, FormControl} from '@angular/forms';
import {Utils} from './Utils';

export class ValidacaoGenericaWCorrea {

    public static validarCPF(input: FormControl): any {
        return Utils.validarCPF(input.value) ? null : {CPF_Invalido: true};
    }

    public static validarCNPJ(input: FormControl): any {
        return Utils.validarCNPJ(input.value) ? null : {CNPJ_Invalido: true};
    }

    public static SelecionarItemNaoObrigatorioCmb(input: FormControl): any {
        if (typeof input.value === 'string' && input.value.length > 0) {
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

    // public static RequeridoSePreenchido(requerido: AbstractControl): any {
    //     if ((typeof requerido.value === 'string' && requerido.value.length > 0) || requerido == null) {
    //         return {required: true};
    //     }
    // }

    public static MoedaValorMinimo(min: number): any {
        return (input: AbstractControl): any => {
            if (input.value && input.value !== undefined && input.value < min) {
                return {Moeda_Valor_Minimo: new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(min)};
            }
            return null;
        };
    }
}
