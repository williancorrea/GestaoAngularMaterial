import {NgModule} from '@angular/core';
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
import {VeiculoPesquisaComponent} from './veiculo-pesquisa/veiculo-pesquisa.component';
import {VeiculoNovoComponent} from './veiculo-novo/veiculo-novo.component';
import {VeiculoMarcaPesquisaComponent} from './veiculo-marca-pesquisa/veiculo-marca-pesquisa.component';
import {VeiculoMarcaNovoComponent} from './veiculo-marca-novo/veiculo-novo.component';

const routes = [
    { path: 'todos', component: VeiculoPesquisaComponent },
    { path: 'todos/novo', component: VeiculoNovoComponent },
    { path: 'todos/:key', component: VeiculoNovoComponent },

    { path: 'marca', component: VeiculoMarcaPesquisaComponent  },
    { path: 'marca/novo', component: VeiculoMarcaNovoComponent },
    { path: 'marca/:key', component: VeiculoMarcaNovoComponent },

    {path: '**', redirectTo: 'todos'}
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
        VeiculoPesquisaComponent,
        VeiculoNovoComponent,
        VeiculoMarcaPesquisaComponent,
        VeiculoMarcaNovoComponent
    ],
    exports: []
})

export class VeiculoModule {
}
