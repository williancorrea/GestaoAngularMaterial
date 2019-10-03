import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import {fuseAnimations} from '@fuse/animations';
import {environment} from '../../../../../../environments/environment';
import {FretamentoService} from '../../fretamento.service';
import {Utils} from '../../../../../core/utils/Utils';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FuseConfirmDialogComponent} from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-fretamento-eventual-pesquisa',
    templateUrl: './fretamento-eventual-pesquisa.component.html',
    styleUrls: ['./fretamento-eventual-pesquisa.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FretamentoEventualPesquisaComponent implements OnInit, AfterViewInit {

    fretamentoList: null;
    // displayedColumns = ['id', 'image', 'name', 'category', 'price', 'quantity', 'active'];
    displayedColumns = ['numero_contrato', 'image', 'name', 'itinerario_horarios', 'itinerario_cidade', 'valor', 'buttons'];

    @ViewChild(MatPaginator, {static: true})
    paginador: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filtro: ElementRef;

    env: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(private fretamentoService: FretamentoService,
                public dialog: MatDialog) {
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

    abrirDialogDeCancelamentoDeContrato(obj: any, indexColuna: number): void {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {disableClose: false});

        this.confirmDialogRef.componentInstance.confirmMessage = 'Tem certeza que deseja cancelar o contrato ' + obj['numeroContrato'] + ' ?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.fretamentoService.cancelarContrato(obj['key']).then(resultado => {
                    this.pesquisar();
                }).catch(error => {
                    // TODO: Colocar mensagem de erro para o usuario
                    console.log('ERRO AO SALVAR: ', error);
                    // this.errorHandler.handle(error);
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
                this.fretamentoService.ativarContrato(obj['key']).then(resultado => {
                    this.pesquisar();
                }).catch(error => {
                    // TODO: Colocar mensagem de erro para o usuario
                    console.log('ERRO AO SALVAR: ', error);
                    // this.errorHandler.handle(error);
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
                this.fretamentoService.contratarFretamento(obj['key']).then(resultado => {
                    this.pesquisar();
                }).catch(error => {
                    // TODO: Colocar mensagem de erro para o usuario
                    console.log('ERRO AO SALVAR: ', error);
                    // this.errorHandler.handle(error);
                });
            }
            this.confirmDialogRef = null;
        });
    }

    ngAfterViewInit(): void {
        this.pesquisar();
    }

    paginadorEvento(event?: PageEvent): PageEvent {
        this.pesquisar();
        return event;
    }

    pesquisar(): void {
        this.fretamentoService.listarTodos(this.paginador, this.filtro).then(response => {

            this.fretamentoList = response['content'];
            this.paginador.length = response['totalElements'];

        }).catch(error => {
            // TODO: Colocar mensagem de erro para o usuario
            console.log('ERRO AO SALVAR: ', error);
            // this.errorHandler.handle(error);
        });
    }

    imprimirContrato(obj: any): void {
        this.fretamentoService.gerarContrato(obj['key']).then(relatorio => {
            Utils.fazerDownloadArquivoBlobEmPDF('Contrato ' + obj['numeroContrato'] + ' - ' + obj['cliente']['nome'], relatorio);
        }).catch(error => {
            // TODO: Colocar mensagem de erro para o usuario
            console.log('ERRO AO SALVAR: ', error);
            // this.errorHandler.handle(error);
        });
    }

    imprimirTermoResponsabilidadeMotorista(obj: any): void {
        this.fretamentoService.gerarTermoResponsabilidadeMotorista(obj['key']).then(relatorio => {
            Utils.fazerDownloadArquivoBlobEmPDF('Termo_de_Responsabilidade', relatorio);
        }).catch(error => {
            // TODO: Colocar mensagem de erro para o usuario
            console.log('ERRO AO SALVAR: ', error);
            // this.errorHandler.handle(error);
        });
    }

}
