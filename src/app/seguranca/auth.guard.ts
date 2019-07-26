import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';


import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router
    ) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (this.auth.isAccessTokenInvalido()) {
            console.log('Navegação com access token inválido. Obtendo novo token...');

            return this.auth.obterNovoAccessToken()
                .then(() => {
                    if (this.auth.isAccessTokenInvalido()) {
                        this.router.navigate(['/autenticacao/login']);
                        return false;
                    }

                    return true;
                });
        } else if (next.data.roles && !this.auth.temQualquerPermissao(next.data.roles)) {
            //TODO: COLOCAR O COMPONENTE DE PAGINA NAO AUTORIZADA
            this.router.navigate(['/nao-autorizado']);
            return false;
        }

        return true;
    }

}
