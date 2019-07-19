import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {JwtHelperService} from '@auth0/angular-jwt';

import {environment} from './../../environments/environment';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

    oauthTokenUrl: string;
    jwtPayload: any;

    constructor(private http: HttpClient,
                private jwtHelperService: JwtHelperService,
                private router: Router) {
        this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
        this.carregarToken();
    }

    login(usuario: string, senha: string): Promise<void> {
        const headers = new HttpHeaders()
            .append('Content-Type', 'application/x-www-form-urlencoded')
            .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

        const body = `username=${usuario}&password=${senha}&grant_type=password`;

        return this.http.post<any>(this.oauthTokenUrl, body, {headers, withCredentials: true})
            .toPromise()
            .then(response => {
                this.armazenarToken(response.access_token);
            })
            .catch(response => {
                if (response.status === 400) {
                    if (response.error === 'invalid_grant') {
                        return Promise.reject('Usuário ou senha inválida!');
                    }
                } else if (response.status === 0) {
                    // Erro no back-end
                    this.router.navigate(['/erro']);
                }

                return Promise.reject(response);
            });
    }

    obterNovoAccessToken(): Promise<void> {
        const headers = new HttpHeaders()
            .append('Content-Type', 'application/x-www-form-urlencoded')
            .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

        const body = 'grant_type=refresh_token';

        return this.http.post<any>(this.oauthTokenUrl, body, {headers, withCredentials: true})
            .toPromise()
            .then(response => {
                this.armazenarToken(response.access_token);

                console.log('Novo access token criado!');

                return Promise.resolve(null);
            })
            .catch(response => {
                console.error('Erro ao renovar token.', response);
                return Promise.resolve(null);
            });
    }

    /**
     * Remove o token de acesso do armazenamento local
     */
    limparAccessToken(): void {
        localStorage.removeItem('token');
        this.jwtPayload = null;
    }

    /**
     * Verifica se o token de acesso está inválido
     */
    isAccessTokenInvalido(): any {
        const token = localStorage.getItem('token');
        return !token || this.jwtHelperService.isTokenExpired(token);
    }

    /**
     * Verifica se o usuário tem uma permissão específica
     */
    temPermissao(permission: string): boolean {
        return (this.jwtPayload && this.jwtPayload.authorities && this.jwtPayload.authorities.includes(permission)) ? true : false;
    }

    /**
     * Verifica se o usuário tem pelo menos uma permissão
     */
    temQualquerPermissao(roles): boolean {
        for (const role of roles) {
            if (this.temPermissao(role)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Armazena o token no armazenamento local
     */
    private armazenarToken(token: string): void {
        this.jwtPayload = this.jwtHelperService.decodeToken(token);
        localStorage.setItem('token', token);
    }

    /**
     * Carrega o token armazenado no armazenamento local
     */
    private carregarToken(): void {
        const token = localStorage.getItem('token');
        if (token) {
            this.armazenarToken(token);
        }
    }

}
