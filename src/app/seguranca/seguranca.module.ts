import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthGuard} from './auth.guard';
import {LogoutService} from './logout.service';
import {JwtModule} from '@auth0/angular-jwt';
import {environment} from '../../environments/environment';

export function tokenGetter() {
    return localStorage.getItem('token');
}

@NgModule({
    imports: [
        CommonModule,

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
