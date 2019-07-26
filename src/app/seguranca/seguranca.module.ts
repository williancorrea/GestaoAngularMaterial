import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthGuard} from './auth.guard';
import {LogoutService} from './logout.service';
import {JwtModule} from '@auth0/angular-jwt';
import {environment} from '../../environments/environment';
import {Login2Module} from './autenticacao/login/login-2.module';

export function tokenGetter(): any {
    return localStorage.getItem('token');
}

@NgModule({
    imports: [
        CommonModule,
        Login2Module,

        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: environment.tokenWhitelistedDomains,
                blacklistedRoutes: environment.tokenBlacklistedRoutes
            }
        })
    ],
    declarations: [],
    providers: [
        AuthGuard,
        LogoutService
    ]
})

export class SegurancaModule {

}
