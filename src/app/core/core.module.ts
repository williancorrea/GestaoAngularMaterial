import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';

import {ErroManipuladorService} from './erro-manipulador.service';
import {MessageComponent} from './message/message.component';
import {FretamentoService} from '../main/apps/fretamento/fretamento.service';
import {GestaoService} from '../seguranca/autenticacao/gestao.service';
import {IConfig, NgxMaskModule} from 'ngx-mask';

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,

        // Mascaras dos Campos
        NgxMaskModule.forRoot(options),

    ],
    declarations: [
        MessageComponent
    ],
    exports: [
        MessageComponent
    ],
    providers: [
        // AuthService,
        // JwtHelperService,

        GestaoService,
        ErroManipuladorService,

        FretamentoService,
        // VeiculoService,
        // ControleKmService,
        // CombustivelService,
        // TanqueCombustivelService
    ]
})
export class CoreModule {
}
