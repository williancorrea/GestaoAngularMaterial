import {AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import {fuseAnimations} from '@fuse/animations';
import {environment} from '../../../../../../environments/environment';
import {FretamentoService} from '../../../../../core/services/fretamento.service';
import {Utils} from '../../../../../core/utils/Utils';
import {fromEvent} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FuseConfirmDialogComponent} from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {ErroManipuladorService} from '../../../../../core/componentes/erro-manipulador.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {VeiculoService} from '../../../../../core/services/veiculo.service';
import {ValidacaoGenericaWCorrea} from '../../../../../core/utils/ValidacaoGenericaWCorrea';

@Component({
    selector: 'app-fretamento-eventual-pesquisa',
    templateUrl: './fretamento-eventual-pesquisa.component.html',
    styleUrls: ['./fretamento-eventual-pesquisa.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FretamentoEventualPesquisaComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked {

    carregandoDados = false;
    cmbCarregando = false;
    cmbVeiculoLista = [];

    mensagemErro = '';
    fretamentoList: null;
    displayedColumns = ['numero_contrato', 'image', 'name', 'itinerario_horarios', 'itinerario_cidade', 'valor', 'buttons'];

    form: FormGroup;

    temFiltroAtivo = false;

    @ViewChild(MatPaginator, {static: true})
    paginador: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filtro: ElementRef;

    @ViewChild('filtroAvancado', {static: true})
    filtroAvancado: ElementRef;
    mostrarFiltroAvancado: boolean;

    @ViewChild('paginaCompleta', {static: true})
    paginaCompleta: ElementRef;


    @ViewChild('tabela', {read: ElementRef, static: true}) tabela: ElementRef;

    env: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(private fretamentoService: FretamentoService,
                private veiculoService: VeiculoService,
                private errorHandler: ErroManipuladorService,
                public dialog: MatDialog,
                private router: Router,
                private formBuild: FormBuilder,
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
                this.verificaSeTemFiltrosAtivos();
                this.pesquisar();
            });

        fromEvent(this.filtro.nativeElement, 'focus')
            .subscribe(resposta => {
                resposta['stopPropagation']();
                console.log('Focus');
                this.mostrarFiltroAvancado = true;
            });
        fromEvent(this.filtro.nativeElement, 'click')
            .subscribe(resposta => {
                resposta['stopPropagation']();
                this.mostrarFiltroAvancado = true;
            });

        fromEvent(this.paginaCompleta.nativeElement, 'click')
            .subscribe(resposta => {
                resposta['stopPropagation']();
                this.mostrarFiltroAvancado = false;
                console.log('Clicou fora', false);
            });

        fromEvent(this.filtroAvancado.nativeElement, 'click').subscribe(r2 => {
            r2['stopPropagation']();
            // this.mostrarFiltroAvancado = true;
            console.log('Clicou dentro', true);
        });

        this.mostrarFiltroAvancado = false;
        this.configurarForm();
    }

    configurarForm(): void {
        this.form = this.formBuild.group({
            dataPartida: [''],
            dataRetorno: [''],
            veiculo: [null, [ValidacaoGenericaWCorrea.SelecionarItemObrigatorioCmb]],
            situacaoNaoContratado: [false],
            situacaoOrcamento: [false],
            situacaoContratado: [false]
        });

        this.form.get('veiculo').valueChanges
            .pipe(
                debounceTime(this.env.comboBox.filtroDelay),
                map(pesquisa => {
                    if (typeof pesquisa === 'string') {
                        return pesquisa.trim();
                    }
                }),
                distinctUntilChanged(),
                tap(pesquisa => {
                    this.cmbCarregando = true;
                })
            )
            .subscribe(pesquisa => {
                this.cmbVeiculoLista = [];
                if (typeof pesquisa !== 'string') {
                    this.cmbCarregando = false;
                    return;
                }
                this.veiculoService.pesquisarVeiculoCmbFretamento(pesquisa).then(resposta => {
                    this.cmbVeiculoLista = resposta;
                }).catch(error => {
                    this.mensagemErro = this.errorHandler.handle(error);
                }).finally(() => {
                    this.cmbCarregando = false;
                });
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

    btnPesquisaFiltroAvancadoAbrir(event: any): void {
        event['stopPropagation']();
        this.mostrarFiltroAvancado = true;
    }

    btnFiltrar(event: any): void {
        event['stopPropagation']();
        this.mostrarFiltroAvancado = false;
        this.pesquisar();
    }

    btnLimparFiltro(event: any): void {
        event['stopPropagation']();
        this.mostrarFiltroAvancado = false;
        this.form.reset();
        this.filtro.nativeElement.value = '';
        this.pesquisar();
    }

    paginadorEvento(event?: PageEvent): PageEvent {
        this.pesquisar();
        return event;
    }

    pesquisar(): void {
        this.verificaSeTemFiltrosAtivos();
        this.carregandoDados = true;

        this.fretamentoService.listarTodos(this.paginador, this.filtro, this.form.getRawValue()).then(response => {
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

    verificaSeTemFiltrosAtivos(): void {
        if ((this.filtro.nativeElement.value && this.filtro.nativeElement.value.trim().length > 0) ||
            this.form.get('dataPartida').value || this.form.get('dataRetorno').value || this.form.get('veiculo').value != null ||
        this.form.get('situacaoNaoContratado').value || this.form.get('situacaoOrcamento').value || this.form.get('situacaoContratado').value) {
            this.temFiltroAtivo = true;
        } else {
            this.temFiltroAtivo = false;
        }

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

    mostrarNomeVeiculo(obj?: any): string | undefined {
        return obj ? obj.frota + ' - ' + obj.placa : undefined;
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

    clonarFretamento(obj: any): void {
        this.router.navigateByUrl('/fretamento/eventual/' + obj.key + '?clonado=true');
    }


}
