import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {TranslateModule} from '@ngx-translate/core';
import 'hammerjs';

import {FuseModule} from '@fuse/fuse.module';
import {FuseSharedModule} from '@fuse/shared.module';
import {FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule} from '@fuse/components';

import {fuseConfig} from 'app/fuse-config';

import {FakeDbService} from 'app/fake-db/fake-db.service';
import {AppComponent} from 'app/app.component';
import {AppStoreModule} from 'app/store/store.module';
import {LayoutModule} from 'app/layout/layout.module';
import {SegurancaModule} from './seguranca/seguranca.module';
import {CoreModule} from './core/core.module';
import {ngxLoadingAnimationTypes, NgxLoadingModule} from 'ngx-loading';


const appRoutes: Routes = [
    {
        path: 'apps',
        loadChildren: './main/apps/apps.module#AppsModule',

    },
    {
        path: 'pages',
        loadChildren: './main/pages/pages.module#PagesModule',
    },
    {
        path: 'ui',
        loadChildren: './main/ui/ui.module#UIModule'
    },
    {
        path: 'documentation',
        loadChildren: './main/documentation/documentation.module#DocumentationModule'
    },
    {
        path: 'angular-material-elements',
        loadChildren: './main/angular-material-elements/angular-material-elements.module#AngularMaterialElementsModule'
    },


    { path: 'autenticacao', loadChildren: './seguranca/autenticacao/login/login-2.module#Login2Module' },
    { path: 'fretamento', loadChildren: './main/apps/fretamento/fretamento.module#FretamentoModule' },

    { path: 'cadastro/pessoa', loadChildren: './cadastro/pessoa/pessoa.module#PessoaModule' },
    { path: 'cadastro/veiculo', loadChildren: './cadastro/veiculo/veiculo.module#VeiculoModule' },

    { path: '**', redirectTo: 'apps/dashboards/analytics' }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AppStoreModule,

        // TODO: MONTAR UMA PAGINA DE CONFIGURACAO PERSONALIZADA PARA ESSAS CONFIGURACOES
        // https://www.npmjs.com/package/ngx-loading
        // https://stackblitz.com/github/Zak-C/ngx-loading?file=src%2Fapp%2Fapp.component.ts
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.wanderingCubes,
            backdropBackgroundColour: 'rgba(0,0,0,0.2)',
            backdropBorderRadius: '0px',
            primaryColour: 'green',
            secondaryColour: 'red',
            tertiaryColour: 'blue',
            fullScreenBackdrop: true
        }),

        // WCorrea
        CoreModule,
        SegurancaModule
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
