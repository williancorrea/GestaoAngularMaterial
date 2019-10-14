import {AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {MatDialog, MatDialogRef, MatPaginator, MatSort, PageEvent} from '@angular/material';
import {FuseConfirmDialogComponent} from '../../../../@fuse/components/confirm-dialog/confirm-dialog.component';
import {ErroManipuladorService} from '../../../core/componentes/erro-manipulador.service';
import {environment} from '../../../../environments/environment';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {VeiculoService} from '../../../core/services/veiculo.service';

@Component({
    selector: 'app-motorista-pesquisa',
    templateUrl: './veiculo-pesquisa.component.html',
    styleUrls: ['./veiculo-pesquisa.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class VeiculoPesquisaComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked {

    carregandoDados = false;
    mensagemErro = '';
    listaDados: null;
    // displayedColumns = ['ativo', 'imagem', 'nome', 'cidade_estado', 'telefone1', 'telefone2', 'buttons'];
    displayedColumns = ['inativo', 'frota', 'placa', 'qtd_lugares', 'consumo', 'buttons'];

    @ViewChild(MatPaginator, {static: true})
    paginador: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filtro: ElementRef;

    @ViewChild('tabela', {read: ElementRef, static: true}) tabela: ElementRef;

    env: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(private veiculoService: VeiculoService,
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
        this.veiculoService.listar(this.paginador, this.filtro).then(response => {

            this.listaDados = response['content'];
            this.paginador.length = response['totalElements'];

        }).catch(error => {
            this.mensagemErro = this.errorHandler.handle(error);
        }).finally(() => {
            this.tabela.nativeElement['scrollTop'] = 0;
            this.carregandoDados = false;
            this.cdr.detectChanges();
        });
    }
}
