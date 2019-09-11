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
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {CURRENCY_MASK_CONFIG, CurrencyMaskConfig} from 'ng2-currency-mask/src/currency-mask.config';


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

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: 'right',
    allowNegative: false,
    decimal: ',',
    precision: 2,
    prefix: 'R$ ',
    suffix: '',
    thousands: '.'
};

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,

        // Mascara de Dinheiro
        CurrencyMaskModule,

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

        // Dinheiro
        {provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig},

        // Formatacao das Datas
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
