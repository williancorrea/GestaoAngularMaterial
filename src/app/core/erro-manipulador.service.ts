import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {NotAuthenticatedError} from '../seguranca/transport-http';


@Injectable()
export class ErroManipuladorService {

    constructor(private router: Router) {
    }

    handle(errorResponse: any): any {
        let mensagemErro: string;

        console.log('DEU ZICA', errorResponse);

        if (typeof errorResponse === 'string') {
            mensagemErro = errorResponse;
        } else if (errorResponse instanceof NotAuthenticatedError) {
            mensagemErro = 'Sua sessão expirou';
            this.router.navigate(['/login']);
        } else if (errorResponse instanceof HttpErrorResponse && errorResponse.status >= 400 && errorResponse.status <= 499) {
            mensagemErro = 'Ocorreu um erro ao processar a sua solicitação, tente novamente.';

            if (errorResponse.status === 403) {
                mensagemErro = 'Você não tem permissão para executar esta ação.';
                this.router.navigate(['/acesso-negado']);
            }

            try {
                mensagemErro = errorResponse.error[0].userMessage;
            } catch (e) {
            }

            console.error('Ocorreu um erro', errorResponse);
        } else {
            mensagemErro = 'Erro ao processar serviço remoto. Tente novamente.';
            console.error('Ocorreu um erro no back-end', errorResponse);

            // Erro no back-end
            this.router.navigate(['/erro']);
        }

        // this.toasty.add({severity: 'error', detail: mensagemErro});
        return mensagemErro;
    }

}
