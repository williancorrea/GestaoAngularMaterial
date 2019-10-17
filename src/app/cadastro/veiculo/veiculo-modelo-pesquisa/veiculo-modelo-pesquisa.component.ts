import {AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {MatDialog, MatDialogRef, MatPaginator, MatSort, PageEvent} from '@angular/material';
import {FuseConfirmDialogComponent} from '../../../../@fuse/components/confirm-dialog/confirm-dialog.component';
import {ErroManipuladorService} from '../../../core/componentes/erro-manipulador.service';
import {environment} from '../../../../environments/environment';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {VeiculoModeloService} from '../../../core/services/veiculoModelo.service';

@Component({
    selector: 'app-veiculo-modelo-pesquisa',
    templateUrl: './veiculo-modelo-pesquisa.component.html',
    styleUrls: ['./veiculo-modelo-pesquisa.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class VeiculoModeloPesquisaComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked {

    carregandoDados = false;
    mensagemErro = '';
    listaDados: null;
    displayedColumns = ['inativo', 'nome'];

    @ViewChild(MatPaginator, {static: true})
    paginador: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filtro: ElementRef;

    @ViewChild('tabela', {read: ElementRef, static: true}) tabela: ElementRef;

    env: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(private veiculoModeloService: VeiculoModeloService,
                private errorHandler: ErroManipuladorService,
                public dialog: MatDialog,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.env = environment;

        fromEvent(this.filtro.nativeElement, 'keyup')
            .pipe(
                debounceTime(this.env.comboBox.filtroDelay),
                distinctUntilChanged(),
            )
            .subscribe(() => {
                this.paginador.pageIndex = 0;
                this.pesquisar();
            });
    }

    ngAfterViewInit(): void {
        this.paginador.pageSize = 20;

        this.pesquisar();
        this.cdr.detectChanges();
    }

    ngAfterViewChecked(): void {
        this.cdr.detectChanges();
    }

    ngAfterContentChecked(): void {
        this.cdr.detectChanges();
    }

    paginadorEvento(event?: PageEvent): PageEvent {
        this.pesquisar();
        return event;
    }

    pesquisar(): void {
        this.carregandoDados = true;
        this.veiculoModeloService.listar(this.paginador, this.filtro).then(response => {

            this.listaDados = response;
            this.paginador.length = response.length;

        }).catch(error => {
            this.mensagemErro = this.errorHandler.handle(error);
        }).finally(() => {
            this.tabela.nativeElement['scrollTop'] = 0;
            this.carregandoDados = false;
            this.cdr.detectChanges();
        });
    }
}
