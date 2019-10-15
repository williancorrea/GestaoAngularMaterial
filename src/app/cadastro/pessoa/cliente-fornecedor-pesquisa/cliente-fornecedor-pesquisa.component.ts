import {AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {MatDialog, MatPaginator, MatSort, PageEvent} from '@angular/material';
import {ErroManipuladorService} from '../../../core/componentes/erro-manipulador.service';
import {environment} from '../../../../environments/environment';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {PessoaService} from '../../../core/services/Pessoa.service';

@Component({
    selector: 'app-cliente-fornecedora-pesquisa',
    templateUrl: './cliente-fornecedor-pesquisa.component.html',
    styleUrls: ['./cliente-fornecodor-pesquisa.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ClienteFornecedorPesquisaComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked {

    carregandoDados = false;
    mensagemErro = '';
    clitenFornecodorList: null;
    displayedColumns = ['imagem', 'nome', 'cidade_estado', 'telefone1', 'telefone2'];

    @ViewChild(MatPaginator, {static: true})
    paginador: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filtro: ElementRef;

    @ViewChild('tabela', {read: ElementRef, static: true}) tabela: ElementRef;

    env: any;

    constructor(private pessoaService: PessoaService,
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
        this.pessoaService.listarTodosClienteFornecedor(this.paginador, this.filtro).then(response => {

            this.clitenFornecodorList = response['content'];
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
