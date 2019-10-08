import {LOCALE_ID, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule, registerLocaleData} from '@angular/common';

import {ErroManipuladorService} from './componentes/erro-manipulador.service';
import {MessageComponent} from './componentes/message/message.component';
import {FretamentoService} from './services/fretamento.service';
import {GestaoService} from '../seguranca/autenticacao/gestao.service';
import {IConfig, NgxMaskModule} from 'ngx-mask';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatPaginatorIntl} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {CURRENCY_MASK_CONFIG, CurrencyMaskConfig} from 'ng2-currency-mask/src/currency-mask.config';
import {VeiculoService} from './services/veiculo.service';

import pt from '@angular/common/locales/pt';
import {ErrorServiceComponent} from './componentes/message/error-service.component';
import {ImagemBase64Component} from './componentes/imagem-base64/imagem-base64.component';
import {ImagemBase64DialogComponent} from './componentes/imagem-base64-dialog/imagem-base64-dialog.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {NgxLoadingModule} from 'ngx-loading';
import {PessoaService} from './services/Pessoa.service';
import {CidadeService} from './services/cidade.service';

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
    paginatorIntl.firstPageLabel = 'Primeira pagina';
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

        MatDialogModule,
        MatButtonModule,
        ImageCropperModule,
        NgxLoadingModule
    ],
    entryComponents: [
        ImagemBase64Component,
        ImagemBase64DialogComponent
    ],
    declarations: [
        MessageComponent,
        ErrorServiceComponent,
        ImagemBase64Component,
        ImagemBase64DialogComponent
    ],
    exports: [
        MessageComponent,
        ErrorServiceComponent,
        ImagemBase64Component,
        ImagemBase64DialogComponent
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
        PessoaService,
        CidadeService

        // ControleKmService,
        // CombustivelService,
        // TanqueCombustivelService
    ]
})
export class CoreModule {
}
