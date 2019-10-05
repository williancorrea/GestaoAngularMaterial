import {LOCALE_ID, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule, registerLocaleData} from '@angular/common';

import {ErroManipuladorService} from './componentes/erro-manipulador.service';
import {MessageComponent} from './componentes/message/message.component';
import {FretamentoService} from '../main/apps/fretamento/fretamento.service';
import {GestaoService} from '../seguranca/autenticacao/gestao.service';
import {IConfig, NgxMaskModule} from 'ngx-mask';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatCardModule, MatIconModule, MatPaginatorIntl} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {CURRENCY_MASK_CONFIG, CurrencyMaskConfig} from 'ng2-currency-mask/src/currency-mask.config';
import {VeiculoService} from '../main/apps/fretamento/veiculo.service';

import pt from '@angular/common/locales/pt';
import {ErrorServiceComponent} from './componentes/message/error-service.component';

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
    thousands: '.',
};

const paginadorAlcanceLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
    }
    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
};


export function getPaginadorTraducao(): any {
    const paginatorIntl = new MatPaginatorIntl();

    paginatorIntl.itemsPerPageLabel = 'Itens por pagina:';
    paginatorIntl.firstPageLabel = 'Primeira pagina'
    paginatorIntl.nextPageLabel = 'Próxima pagina';
    paginatorIntl.previousPageLabel = 'Voltar pagina';
    paginatorIntl.lastPageLabel = 'Ultima pagina';
    paginatorIntl.getRangeLabel = paginadorAlcanceLabel;

    return paginatorIntl;
}

export let options: Partial<IConfig> | (() => Partial<IConfig>);

// REGISRANDO A APLICACAO PARA PT-BR
registerLocaleData(pt, 'pt');

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,

        // Mascara de Dinheiro
        CurrencyMaskModule,

        // Mascaras dos Campos
        NgxMaskModule.forRoot(options),
        MatIconModule,
        MatCardModule,
    ],
    declarations: [
        MessageComponent,
        ErrorServiceComponent
    ],
    exports: [
        MessageComponent,
        ErrorServiceComponent
    ],
    providers: [
        // AuthService,
        // JwtHelperService,

        // Define a APLICACAO sendo do BR idependente do navegador
        {provide: LOCALE_ID, useValue: 'pt'},

        // Dinheiro
        {provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig},

        // Formatacao das Datas
        {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},

        // Paginador Material design
        {provide: MatPaginatorIntl, useValue: getPaginadorTraducao()},

        GestaoService,
        ErroManipuladorService,

        FretamentoService,
        VeiculoService,
        // ControleKmService,
        // CombustivelService,
        // TanqueCombustivelService
    ]
})
export class CoreModule {
}
