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

        console.error('DEU ZICA', errorResponse);

        if (typeof errorResponse === 'string') {
            mensagemErro = errorResponse;
        } else if (errorResponse instanceof NotAuthenticatedError) {
            mensagemErro = 'Sua sessão expirou';
            this.router.navigate(['/login']);
        } else if (errorResponse instanceof HttpErrorResponse && errorResponse.status >= 400 && errorResponse.status <= 499) {
            mensagemErro = 'Ocorreu um erro ao processar a sua solicitação, tente novamente.';

            try {
                if (errorResponse['error']['error'] === 'invalid_grant') {
                    mensagemErro = 'Usuário e/ou senha incorreto(s)';
                }

                if (errorResponse.status === 403) {
                    mensagemErro = 'Você não tem permissão para executar esta ação.';
                    this.router.navigate(['/acesso-negado']);
                }


                mensagemErro = errorResponse.error[0].userMessage;
            } catch (e) {
            }
        } else {
            mensagemErro = 'Erro ao processar serviço remoto. Tente novamente.';
            console.error('Ocorreu um erro no back-end', errorResponse);

            // Erro no back-end
            this.router.navigate(['/erro']);
        }
        return mensagemErro;
    }

}
