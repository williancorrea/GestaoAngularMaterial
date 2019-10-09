import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {ErroManipuladorService} from '../../../core/componentes/erro-manipulador.service';
import * as moment from 'moment';
import {environment} from '../../../../environments/environment';
import {ValidacaoGenericaWCorrea} from '../../../core/utils/ValidacaoGenericaWCorrea';
import {debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {PESSOA_TIPO} from '../../../core/modelos/PessoaTipo';
import {PessoaService} from '../../../core/services/Pessoa.service';
import {CidadeService} from '../../../core/services/cidade.service';

@Component({
    selector: 'app-motorista-novo',
    templateUrl: './motorista-novo.component.html',
    styleUrls: ['./motorista-novo.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MotoristaNovoComponent implements OnInit {

    mensagemErro = '';
    carregandoDados = false;
    form: FormGroup;
    tipoPagina: string;
    env: any;

    imagemCliente = '';

    cmbCarregando = false;
    cmbCidadeLista: any;


    constructor(private _matSnackBar: MatSnackBar,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private formBuild: FormBuilder,
                private pessoaService: PessoaService,
                private cidadeService: CidadeService,
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
            this.pessoaService.buscarPorKey(editando).then(response => {
                this.form.patchValue(response);
                this.form.get('pessoaFisica').get('cpf').disable();
                this.imagemCliente = this.form.get('imagem').value ? this.form.get('imagem').value : '';

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
            tipo: [PESSOA_TIPO.FISICA, Validators.required],
            email: ['', Validators.email],
            obs: ['', [Validators.maxLength(500)]],
            nome: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
            fantasia: ['', [Validators.maxLength(250)]],
            imagem: [null],
            cidade: [null, [Validators.required, ValidacaoGenericaWCorrea.SelecionarItemObrigatorioCmb]],
            cep: ['', [Validators.maxLength(9)]],
            endereco: ['', [Validators.required, Validators.minLength(5)]],
            bairro: ['', [Validators.required, Validators.minLength(5)]],
            telefone1: ['', [Validators.required]],
            telefone1Obs: ['', [Validators.required]],
            telefone2: [''],
            telefone2Obs: [''],
            pessoaFisica: this.formBuild.group({
                key: [null],
                cpf: ['', [Validators.required, ValidacaoGenericaWCorrea.validarCPF]],
                rg: [''],
                inativoMotorista: [false],
                cnhNumero: ['', [Validators.required, Validators.maxLength(30)]],
                orgaoRg: ['', Validators.required, Validators.maxLength(10)],
                cnhPrimeiraHabilitacao: ['', [Validators.required]],
                cnhEmissaoData: ['', [Validators.required]],
                cnhEmissaoCidade: [null, [Validators.required, ValidacaoGenericaWCorrea.SelecionarItemObrigatorioCmb]],
                cnhVencimento: ['', [Validators.required]],
                dataNascimento: ['', [Validators.required]],
                nomeMae: [''],
                nomePai: [''],
                sexo: ['', [Validators.required]],
                cnhCategoria: [null, [Validators.required]]
            })
        });

        this.form.get('cidade').valueChanges
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
                this.cmbCidadeLista = [];
                if (typeof pesquisa !== 'string') {
                    this.cmbCarregando = false;
                    return;
                }

                console.log('CONSULTANDO CIDADE');

                this.cidadeService.pesquisarCidadeCmb(pesquisa).then(resposta => {
                    this.cmbCidadeLista = resposta;
                }).catch(error => {
                    this.mensagemErro = this.errorHandler.handle(error);
                }).finally(() => {
                    this.cmbCarregando = false;
                });
            });
    }

    gravarFretamento(): void {
        this.carregandoDados = true;

        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid) {
            this.carregandoDados = false;
            return;
        }

        // Adicionando imagem ao cliente
        this.form.get('imagem').setValue(this.imagemCliente ? this.imagemCliente : '');

        if (this.tipoPagina === 'NOVO') {
            this.pessoaService.salvar(this.form.getRawValue()).then(response => {
                this._matSnackBar.open('Motorista gravado com sucesso', 'OK', {verticalPosition: 'bottom', duration: 5000});
                this.router.navigateByUrl('/cadastro/pessoa/motorista');
            }).catch(error => {
                this.mensagemErro = this.errorHandler.handle(error);
            }).finally(() => {
                this.carregandoDados = false;
            });
        } else {
            this.pessoaService.atualizar(this.form.getRawValue()).then(response => {
                this._matSnackBar.open('Motorista atualizado com sucesso', 'OK', {verticalPosition: 'bottom', duration: 5000});
                this.router.navigateByUrl('/cadastro/pessoa/motorista');
            }).catch(error => {
                this.mensagemErro = this.errorHandler.handle(error);
            }).finally(() => {
                this.carregandoDados = false;
            });
        }
    }

    buscarCpfDigitado(): void {
        if (!this.form.get('key').value) {
            if (this.form.get('pessoaFisica').get('cpf').valid) {
                this.carregandoDados = true;
                this.pessoaService.buscarPorCPF(this.form.get('pessoaFisica').get('cpf').value)
                    .then(response => {
                        this.tipoPagina = 'EDICAO';

                        this.form.patchValue(response);
                        this.form.get('pessoaFisica').get('cpf').disable();

                        this.imagemCliente = this.form.get('imagem').value ? this.form.get('imagem').value : '';
                    })
                    .catch(error => {
                        console.log('CPF não encontrado, vida que segue!');
                    }).finally(() => {
                    this.carregandoDados = false;
                });
            }
        }
    }
}
