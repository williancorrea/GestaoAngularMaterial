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
import {CoreModule} from '../../../core/core.module';
import {AuthGuard} from '../../../seguranca/auth.guard';


const routes = [
    {
        path: 'eventual',
        component: FretamentoEventualPesquisaComponent,
        canActivate: [AuthGuard],
        data: {roles: ['ROLE_CMB-PADRAO']}
    },
    {
        path: 'eventual/novo',
        component: FretamentoEventualNovoComponent,
        canActivate: [AuthGuard],
        data: {roles: ['ROLE_CMB-PADRAO']}
    },
    {
        path: 'eventual/:key',
        component: FretamentoEventualNovoComponent,
        canActivate: [AuthGuard],
        data: {roles: ['ROLE_CMB-PADRAO']}
    },
    {
        path: '**',
        // redirectTo: 'eventual/novo'
        redirectTo: 'eventual/1'
    }
];

@NgModule({
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

        FuseSharedModule,
        FuseWidgetModule,

        CoreModule
    ],
    declarations: [
        FretamentoEventualNovoComponent,
        FretamentoEventualPesquisaComponent
    ],
    exports: []
        ,
})
export class FretamentoModule {
}
