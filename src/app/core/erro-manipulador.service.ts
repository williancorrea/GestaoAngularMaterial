import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {NotAuthenticatedError} from '../seguranca/autenticacao/gestao.service';

@Injectable()
export class ErroManipuladorService {

    constructor(private router: Router) {
    }

    handle(errorResponse: any): string {
        let mensagemErro = '';
        // console.error('DEU ZICA', errorResponse);

        if (typeof errorResponse === 'string') {
            mensagemErro = errorResponse;
        } else if (errorResponse instanceof NotAuthenticatedError) {
            mensagemErro = 'Sua sessão expirou';
            this.router.navigate(['/autenticacao/login']);
        } else if (errorResponse instanceof HttpErrorResponse && errorResponse.status >= 400 && errorResponse.status <= 499) {

            try {
                if (errorResponse['error']['error'] === 'invalid_grant') {
                    mensagemErro = 'Usuário e/ou senha incorreto(s)';
                }

                if (errorResponse.status === 403) {
                    mensagemErro = 'Você não tem permissão para executar esta ação.';
                    // TODO: COLOCAR O COMPONENTE DE ACESSO NEGADO
                    this.router.navigate(['/acesso-negado']);
                }

                for (let i = 0; errorResponse.error.length > 0; i++) {
                    mensagemErro += errorResponse.error[i].userMessage;
                    if (i > 0 && i < errorResponse.error.length) {
                        mensagemErro += '<br>';
                    }
                }
            } catch (e) {
            }

            if (mensagemErro.length === 0) {
                mensagemErro = 'Ocorreu um erro no servidor ao processar a sua solicitação, tente novamente.';
            }
        } else {
            mensagemErro = 'Ocorreu um erro no servidor ao processar a sua solicitação, tente novamente.';


            // Colocar uma Pagina personalizada para os erros do tipo 500


            // Erro no back-end
            // TODO: COLOCAR O COMPONENTE DE PAGINA DE ERRO
            // this.router.navigate(['/erro']);
        }
        return mensagemErro;
    }

}
