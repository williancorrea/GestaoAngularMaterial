import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LogoutService} from './logout.service';
import {Login2Module} from './autenticacao/login/login-2.module';

// export function tokenGetter(): any {
//     return localStorage.getItem('token');
// }

@NgModule({
    imports: [
        CommonModule,
        Login2Module,

        // JwtModule.forRoot({
        //     config: {
        //         tokenGetter: tokenGetter,
        //         whitelistedDomains: environment.tokenWhitelistedDomains,
        //         blacklistedRoutes: environment.tokenBlacklistedRoutes
        //     }
        // })
    ],
    declarations: [],
    providers: [
        // AuthGuard,
        // AuthService,
        //
        // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        LogoutService
    ]
})

export class SegurancaModule {

}
