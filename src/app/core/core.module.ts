import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {ErroManipuladorService} from './erro-manipulador.service';
import {JwtHelperService} from '@auth0/angular-jwt';

import {AuthService} from '../seguranca/auth.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule
    ],
    declarations: [],
    exports: [],
    providers: [
        ErroManipuladorService,
        AuthService,

        JwtHelperService

        // VeiculoService,
        // ControleKmService,
        // CombustivelService,
        // TanqueCombustivelService
    ]
})
export class CoreModule {
}
