import {NgModule} from '@angular/core';
import {MotoristaPesquisaComponent} from './motorista-pesquisa/motorista-pesquisa.component';
import {MotoristaNovoComponent} from './motorista-novo/motorista-novo.component';
import {RouterModule} from '@angular/router';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule
} from '@angular/material';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FuseSharedModule} from '../../../@fuse/shared.module';
import {FuseConfirmDialogModule, FuseWidgetModule} from '../../../@fuse/components';
import {CoreModule} from '../../core/core.module';
import {NgxMaskModule} from 'ngx-mask';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {NgxLoadingModule} from 'ngx-loading';

const routes = [
    {
        path: 'motorista',
        component: MotoristaPesquisaComponent,
        // canActivate: [AuthGuard],
        // data: {roles: ['ROLE_CMB-PADRAO']}
    },
    {
        path: 'motorista/novo',
        component: MotoristaNovoComponent,
        // canActivate: [AuthGuard],
        // data: {roles: ['ROLE_CMB-PADRAO']}
    },
    {
        path: 'motorista/:key', component: MotoristaNovoComponent,
        // canActivate: [AuthGuard],
        // data: {roles: ['ROLE_CMB-PADRAO']}
    },
    {path: '**', redirectTo: 'motorista'}
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
        MatGridListModule,
        MatDividerModule,
        MatAutocompleteModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatCardModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatDialogModule,
        MatTooltipModule,

        NgxChartsModule,

        FuseSharedModule,
        FuseWidgetModule,
        FuseConfirmDialogModule,

        CoreModule,

        NgxMaskModule,
        CurrencyMaskModule,
        NgxLoadingModule
    ],
    declarations: [
        MotoristaPesquisaComponent,
        MotoristaNovoComponent
    ],
    exports: []
})

export class PessoaModule {
}
