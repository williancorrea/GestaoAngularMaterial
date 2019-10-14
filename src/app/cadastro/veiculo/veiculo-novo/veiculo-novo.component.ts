import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {ErroManipuladorService} from '../../../core/componentes/erro-manipulador.service';
import * as moment from 'moment';
import {environment} from '../../../../environments/environment';
import {VeiculoService} from '../../../core/services/veiculo.service';

@Component({
    selector: 'app-motorista-novo',
    templateUrl: './veiculo-novo.component.html',
    styleUrls: ['./veiculo-novo.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class VeiculoNovoComponent implements OnInit {

    mensagemErro = '';
    mensagemAlerta = '';
    carregandoDados = false;
    form: FormGroup;
    tipoPagina: string;
    env: any;

    cmbCarregando = false;
    cmbCidadeLista: any;

    @ViewChild('conteudoScroll', {static: true}) conteudoScroll: ElementRef;

    constructor(private _matSnackBar: MatSnackBar,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private formBuild: FormBuilder,
                private veiculoService: VeiculoService,
                private errorHandler: ErroManipuladorService) {
    }

    ngOnInit(): void {
        moment.locale('pt-BR');
        this.env = environment;
        this.configurarForm();

        this.carregandoDados = true;

        const editando = this.activatedRoute.snapshot.params['key'];
        if (editando) {
            this.carregandoDados = true;
            this.tipoPagina = 'EDICAO';
            this.veiculoService.buscarPorKey(editando).then(response => {
                this.form.patchValue(response);
            }).catch(error => {
                this.tipoPagina = 'NOVO';
                this.mensagemErro = this.errorHandler.handle(error);
            }).finally(() => {
                this.carregandoDados = false;
            });
        } else {
            this.tipoPagina = 'NOVO';
            this.carregandoDados = false;
        }
    }

    mostrarNomeCidade(obj?: any): string | undefined {
        return obj ? obj.nome + ' / ' + obj.estado.nome : undefined;
    }

    configurarForm(): void {
        this.form = this.formBuild.group({
            key: [null],
            placa: ['', [Validators.required, Validators.maxLength(8)]],
            frota: ['', [Validators.maxLength(500)]],
            obs: ['', [Validators.maxLength(512)]],
            odometroInicial: ['', [Validators.required]],
            consumoReal: ['', [Validators.required, Validators.min(0)]],
            consumoAtual: ['', [Validators.required, Validators.min(0)]],
            velocidadeMedia: ['', [Validators.required, Validators.max(100)]],
            qtdLugares: [0, [Validators.required, Validators.min(5)]],
            capacidadeTanqueCombustivelLts: [0, [Validators.required, Validators.min(30)]],
            inativo: [false]
        });

        // this.form.get('cidade').valueChanges
        //     .pipe(
        //         debounceTime(this.env.comboBox.filtroDelay),
        //         map(pesquisa => {
        //             if (typeof pesquisa === 'string') {
        //                 return pesquisa.trim();
        //             }
        //         }),
        //         distinctUntilChanged(),
        //         tap(pesquisa => {
        //             this.cmbCarregando = true;
        //         })
        //     )
        //     .subscribe(pesquisa => {
        //         this.cmbCidadeLista = [];
        //         if (typeof pesquisa !== 'string') {
        //             this.cmbCarregando = false;
        //             return;
        //         }
        //
        //         this.cidadeService.pesquisarCidadeCmb(pesquisa).then(resposta => {
        //             this.cmbCidadeLista = resposta;
        //         }).catch(error => {
        //             this.mensagemErro = this.errorHandler.handle(error);
        //         }).finally(() => {
        //             this.cmbCarregando = false;
        //         });
        //     });
    }

    gravar(): void {
        this.carregandoDados = true;
        this.mensagemAlerta = '';

        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid) {
            this.conteudoScroll.nativeElement.scrollTop = 0;
            this.mensagemAlerta = 'Formulário não está preenchido corretamente, verifique..';
            this.carregandoDados = false;
            return;
        }

        if (this.tipoPagina === 'NOVO') {
            this.veiculoService.salvar(this.form.getRawValue()).then(response => {
                this._matSnackBar.open('Veículo gravado com sucesso', 'OK', {verticalPosition: 'bottom', duration: 5000});
                this.router.navigateByUrl('/cadastro/veiculo');
            }).catch(error => {
                this.mensagemErro = this.errorHandler.handle(error);
            }).finally(() => {
                this.carregandoDados = false;
            });
        } else {
            this.veiculoService.atualizar(this.form.getRawValue()).then(response => {
                this._matSnackBar.open('Veículo atualizado com sucesso', 'OK', {verticalPosition: 'bottom', duration: 5000});
                this.router.navigateByUrl('/cadastro/veiculo');
            }).catch(error => {
                this.mensagemErro = this.errorHandler.handle(error);
            }).finally(() => {
                this.carregandoDados = false;
            });
        }
    }
}
