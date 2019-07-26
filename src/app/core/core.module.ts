import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';


import {JwtHelperService} from '@auth0/angular-jwt';

import {ErroManipuladorService} from './erro-manipulador.service';
import {AuthService} from '../seguranca/auth.service';
import {MessageComponent} from './message/message.component';
import {FretamentoService} from '../main/apps/fretamento/fretamento.service';

import {TransportHttp} from '../seguranca/transport-http';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
    ],
    declarations: [
        MessageComponent
    ],
    exports: [
        MessageComponent
    ],
    providers: [
        ErroManipuladorService,
        AuthService,
        TransportHttp,

        JwtHelperService,

        FretamentoService,
        // VeiculoService,
        // ControleKmService,
        // CombustivelService,
        // TanqueCombustivelService
    ]
})
export class CoreModule {
}
