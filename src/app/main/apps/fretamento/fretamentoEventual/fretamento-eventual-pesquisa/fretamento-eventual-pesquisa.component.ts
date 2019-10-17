import {AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import {fuseAnimations} from '@fuse/animations';
import {environment} from '../../../../../../environments/environment';
import {FretamentoService} from '../../../../../core/services/fretamento.service';
import {Utils} from '../../../../../core/utils/Utils';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FuseConfirmDialogComponent} from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {ErroManipuladorService} from '../../../../../core/componentes/erro-manipulador.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-fretamento-eventual-pesquisa',
    templateUrl: './fretamento-eventual-pesquisa.component.html',
    styleUrls: ['./fretamento-eventual-pesquisa.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FretamentoEventualPesquisaComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked {

    carregandoDados = false;
    mensagemErro = '';
    fretamentoList: null;
    displayedColumns = ['numero_contrato', 'image', 'name', 'itinerario_horarios', 'itinerario_cidade', 'valor', 'buttons'];

    @ViewChild(MatPaginator, {static: true})
    paginador: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filtro: ElementRef;

    @ViewChild('tabela', {read: ElementRef, static: true}) tabela: ElementRef;

    env: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(private fretamentoService: FretamentoService,
                private errorHandler: ErroManipuladorService,
                public dialog: MatDialog,
                private router: Router,
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
        this.fretamentoService.listarTodos(this.paginador, this.filtro).then(response => {

            this.fretamentoList = response['content'];
            this.paginador.length = response['totalElements'];
        }).catch(error => {
            this.mensagemErro = this.errorHandler.handle(error);
        }).finally(() => {
            this.tabela.nativeElement['scrollTop'] = 0;
            this.carregandoDados = false;
            this.cdr.detectChanges();
        });
    }

    abrirDialogDeCancelamentoDeContrato(obj: any, indexColuna: number): void {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {disableClose: false});

        this.confirmDialogRef.componentInstance.confirmMessage = 'Tem certeza que deseja cancelar o contrato ' + obj['numeroContrato'] + ' ?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.carregandoDados = true;
                this.fretamentoService.cancelarContrato(obj['key']).then(resultado => {
                    this.pesquisar();
                }).catch(error => {
                    this.mensagemErro = this.errorHandler.handle(error);
                }).finally(() => {
                    this.carregandoDados = false;
                });
            }
            this.confirmDialogRef = null;
        });
    }

    /**
     * QUANDO O CONTRATO FOI CANCELADO, ESTA OPCAO O TORNARA ATIVO NOVAMENTE COM O ESTADO DE ORÇAMENTO
     * @param obj
     * @param indexColuna
     */
    abrirDialogDeAtivarContrato(obj: any, indexColuna: number): void {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {disableClose: false});

        this.confirmDialogRef.componentInstance.confirmMessage = 'Tem certeza que deseja ATIVAR o contrato ' + obj['numeroContrato'] + ' novamente ?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.carregandoDados = true;
                this.fretamentoService.ativarContrato(obj['key']).then(resultado => {
                    this.pesquisar();
                }).catch(error => {
                    this.mensagemErro = this.errorHandler.handle(error);
                }).finally(() => {
                    this.carregandoDados = false;
                });
            }
            this.confirmDialogRef = null;
        });
    }

    abrirDialogDeConcluirFretamento(obj: any, indexColuna: number): void {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {disableClose: false});

        this.confirmDialogRef.componentInstance.confirmMessage = 'Efetivar a contratação do orçamento ' + obj['numeroContrato'] + ' ?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.carregandoDados = true;
                this.fretamentoService.gerarContratarFretamento(obj['key']).then(resultado => {
                    this.pesquisar();
                }).catch(error => {
                    this.mensagemErro = this.errorHandler.handle(error);
                }).finally(() => {
                    this.carregandoDados = false;
                });
            }
            this.confirmDialogRef = null;
        });
    }

    imprimirContrato(obj: any): void {
        this.carregandoDados = true;
        this.fretamentoService.gerarContrato(obj['key']).then(relatorio => {
            Utils.fazerDownloadArquivoBlobEmPDF('Contrato ' + obj['numeroContrato'] + ' - ' + obj['cliente']['nome'], relatorio);
        }).catch(error => {
            this.mensagemErro = this.errorHandler.handle(error);
        }).finally(() => {
            this.carregandoDados = false;
        });
    }

    imprimirTermoResponsabilidadeMotorista(obj: any): void {
        this.carregandoDados = true;
        this.fretamentoService.gerarTermoResponsabilidadeMotorista(obj['key']).then(relatorio => {
            Utils.fazerDownloadArquivoBlobEmPDF('Contrato ' + obj['numeroContrato'] + ' - Termo de Responsabilidade', relatorio);
        }).catch(error => {
            this.mensagemErro = this.errorHandler.handle(error);
        }).finally(() => {
            this.carregandoDados = false;
        });
    }

    imprimirRelatorioViagem(obj: any): void {
        this.carregandoDados = true;
        this.fretamentoService.gerarRelatorioViagem(obj['key']).then(relatorio => {
            Utils.fazerDownloadArquivoBlobEmPDF('Contrato ' + obj['numeroContrato'] + ' - Relatório de Viagem', relatorio);
        }).catch(error => {
            this.mensagemErro = this.errorHandler.handle(error);
        }).finally(() => {
            this.carregandoDados = false;
        });
    }

    clonarFretamento(obj: any): void{
        this.router.navigateByUrl('/fretamento/eventual/' + obj.key + '?clonado=true');
    }

}
