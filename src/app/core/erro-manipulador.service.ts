import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {NotAuthenticatedError} from '../seguranca/autenticacao/gestao.service';

@Injectable()
export class ErroManipuladorService {

    constructor(private router: Router) {
    }

    handle(errorResponse: any, bindMensagemErro: string): void {

        // console.error('DEU ZICA', errorResponse);

        if (typeof errorResponse === 'string') {
            bindMensagemErro = errorResponse;
        } else if (errorResponse instanceof NotAuthenticatedError) {
            bindMensagemErro = 'Sua sessão expirou';
            this.router.navigate(['/autenticacao/login']);
        } else if (errorResponse instanceof HttpErrorResponse && errorResponse.status >= 400 && errorResponse.status <= 499) {
            bindMensagemErro = 'Ocorreu um erro no servidor ao processar a sua solicitação, tente novamente.';

            try {
                if (errorResponse['error']['error'] === 'invalid_grant') {
                    bindMensagemErro = 'Usuário e/ou senha incorreto(s)';
                }

                if (errorResponse.status === 403) {
                    bindMensagemErro = 'Você não tem permissão para executar esta ação.';
                    // TODO: COLOCAR O COMPONENTE DE ACESSO NEGADO
                    this.router.navigate(['/acesso-negado']);
                }

                for (let i = 0; errorResponse.error.length > 0; i++) {
                    bindMensagemErro += errorResponse.error[i].userMessage;
                    if (i > 0 && i < errorResponse.error.length) {
                        bindMensagemErro += '<br>';
                    }
                }
            } catch (e) {
            }
        } else {
            bindMensagemErro = 'Ocorreu um erro no servidor ao processar a sua solicitação, tente novamente.';


            // Colocar uma Pagina personalizada para os erros do tipo 500


            // Erro no back-end
            // TODO: COLOCAR O COMPONENTE DE PAGINA DE ERRO
            // this.router.navigate(['/erro']);
        }
    }

}
