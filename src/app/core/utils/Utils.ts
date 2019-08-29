export class Utils {

    public static clonarObjeto(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }

    public static validarCPF(cpf): boolean {
        if (cpf === null) {
            return false;
        }

        cpf = cpf.replace(/[^\d]+/g, '');

        if (cpf === '') {
            return false;
        }

        // Elimina CPFs invalidos conhecidos
        if (cpf.length !== 11 ||
            cpf === '00000000000' || cpf === '11111111111' || cpf === '22222222222' || cpf === '33333333333' ||
            cpf === '44444444444' || cpf === '55555555555' || cpf === '66666666666' || cpf === '77777777777' ||
            cpf === '88888888888' || cpf === '99999999999') {
            return false;
        }
        // Valida 1o digito
        let add = 0;
        for (let i = 0; i < 9; i++) {
            add += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) {
            rev = 0;
        }
        if (rev !== parseInt(cpf.charAt(9))) {
            return false;
        }
        // Valida 2o digito
        add = 0;
        for (let i = 0; i < 10; i++) {
            add += parseInt(cpf.charAt(i)) * (11 - i);
        }
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) {
            rev = 0;
        }
        if (rev !== parseInt(cpf.charAt(10))) {
            return false;
        }
        return true;
    }

    public static validarCNPJ(cnpj): boolean {
        if (cnpj == null) {
            return false;
        }

        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj === '') {
            return false;
        }

        if (cnpj.length !== 14) {
            return false;
        }

        // Elimina CNPJs invalidos conhecidos
        if (cnpj === '00000000000000' || cnpj === '11111111111111' || cnpj === '22222222222222' ||
            cnpj === '33333333333333' || cnpj === '44444444444444' || cnpj === '55555555555555' ||
            cnpj === '66666666666666' || cnpj === '77777777777777' || cnpj === '88888888888888' ||
            cnpj === '99999999999999') {
            return false;
        }

        // Valida DVs
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        const digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado.toString() !== digitos.charAt(0)) {
            return false;
        }

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado.toString() !== digitos.charAt(1)) {
            return false;
        }
        return true;
    }

    /**
     * VALIDAÇÃO COMPLETA DE DATAS
     * Conteplando anos bi-sextos e meses com 30 e 31 dias
     */
    public static validarData(date): boolean {
        const ExpReg = new RegExp('(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}');
        const ardt = date.split('/');
        let erro = false;
        if (date.search(ExpReg) === -1) {
            erro = true;
        } else if (((ardt[1] === 4) || (ardt[1] === 6) || (ardt[1] === 9) || (ardt[1] === 11)) && (ardt[0] > 30)) {
            erro = true;
        } else if (ardt[1] === 2) {
            if ((ardt[0] > 28) && ((ardt[2] % 4) !== 0)) {
                erro = true;
            }
            if ((ardt[0] > 29) && ((ardt[2] % 4) === 0)) {
                erro = true;
            }
        }
        if (erro) {
            return false;
        }
        return true;
    }
}
