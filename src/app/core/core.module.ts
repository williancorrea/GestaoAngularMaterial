import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';

import {ErroManipuladorService} from './erro-manipulador.service';
import {MessageComponent} from './message/message.component';
import {FretamentoService} from '../main/apps/fretamento/fretamento.service';
import {GestaoService} from '../seguranca/autenticacao/gestao.service';
import {IConfig, NgxMaskModule} from 'ngx-mask';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

export const APP_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MM YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MM YYYY',
    }
};


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

        {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},


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
