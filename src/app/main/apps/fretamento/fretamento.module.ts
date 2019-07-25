import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule, MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule, MatStepperModule,
    MatTableModule,
    MatTabsModule
} from '@angular/material';

import {FuseSharedModule} from '@fuse/shared.module';
import {FuseWidgetModule} from '@fuse/components/widget/widget.module';

import {FretamentoEventualNovoComponent} from './fretamentoEventual/fretamento-eventual-novo/fretamento-eventual-novo.component';
import {FretamentoEventualPesquisaComponent} from './fretamentoEventual/fretamento-eventual-pesquisa/fretamento-eventual-pesquisa.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from '../../../core/core.module';


const routes = [
    {
        path: 'eventual',
        component: FretamentoEventualPesquisaComponent,
    },
    {
        path: 'eventual/novo',
        component: FretamentoEventualNovoComponent,
    },
    {
        path: 'eventual/:key',
        component: FretamentoEventualNovoComponent,
    },
    {
        path: '**',
        redirectTo: 'eventual/novo'
    }
];

@NgModule({
    declarations: [
        FretamentoEventualNovoComponent,
        FretamentoEventualPesquisaComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatStepperModule,
        MatRadioModule,

        NgxChartsModule,

        TranslateModule,

        FuseSharedModule,
        FuseWidgetModule,

        CoreModule
    ]
})
export class FretamentoModule {
}
