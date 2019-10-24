import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
    selector: 'app-cliente-fornecedor-novo',
    templateUrl: './cliente-fornecedor-novo.component.html',
    styleUrls: ['./cliente-fornecedor-novo.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ClienteFornecedorNovoComponent implements OnInit {

    mensagemErro = '';
    mensagemAlerta = '';
    carregandoDados = false;
    form: FormGroup;
    tipoPagina: string;
    env: any;

    imagemCliente = '';

    cmbCarregando = false;
    cmbCidadeLista: any;

    @ViewChild('conteudoScroll', {static: true}) conteudoScroll: ElementRef;

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
            telefone1Obs: ['', [Validators.required, Validators.maxLength(10)]],
            telefone2: [''],
            telefone2Obs: ['', [Validators.maxLength(10)]],
            pessoaFisica: this.formBuild.group({
                key: [null],
                cpf: ['', [Validators.required, ValidacaoGenericaWCorrea.validarCPF]],
                rg: [''],
            }),
            pessoaJuridica: this.formBuild.group({
                key: [null],
                cnpj: [''],
                inscricaoEstadual: [''],
            }),
        });

        this.form.get('tipo').valueChanges.subscribe(valor => {
            if (valor === PESSOA_TIPO.JURIDICA.toString()) {
                this.form.get('pessoaFisica').get('cpf').clearValidators();
                this.form.get('pessoaJuridica').get('cnpj').setValidators([Validators.required, ValidacaoGenericaWCorrea.validarCNPJ]);
                this.form.get('pessoaJuridica').get('inscricaoEstadual').setValidators([Validators.maxLength(15)]);
            } else {
                this.form.get('pessoaFisica').get('cpf').setValidators([Validators.required, ValidacaoGenericaWCorrea.validarCPF]);
                this.form.get('pessoaJuridica').get('cnpj').clearValidators();
                this.form.get('pessoaJuridica').get('inscricaoEstadual').clearValidators();
            }

            // DESABILITAR A EDICAO DO CPF E CNPJ
            setTimeout(() => {
                if (this.form.get('key').value) {
                    this.form.get('pessoaFisica').get('cpf').disable();
                    this.form.get('pessoaJuridica').get('cnpj').disable();
                } else {
                    this.form.get('pessoaFisica').get('cpf').enable();
                    this.form.get('pessoaJuridica').get('cnpj').enable();
                }
            });
            this.form.updateValueAndValidity(); // Forca a atualizacao do objeto
            this.form.get('pessoaFisica').updateValueAndValidity(); // Forca a atualizacao do objeto
            this.form.get('pessoaJuridica').updateValueAndValidity(); // Forca a atualizacao do objeto
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

                this.cidadeService.pesquisarCidadeCmb(pesquisa).then(resposta => {
                    this.cmbCidadeLista = resposta;
                }).catch(error => {
                    this.mensagemErro = this.errorHandler.handle(error);
                }).finally(() => {
                    this.cmbCarregando = false;
                });
            });


    }

    gravar(): void {
        this.carregandoDados = true;
        this.mensagemAlerta = '';

        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        console.log(this.form);

        if (this.form.invalid) {
            this.conteudoScroll.nativeElement.scrollTop = 0;
            this.mensagemAlerta = 'Formulário não está preenchido corretamente, verifique..';
            this.carregandoDados = false;
            return;
        }

        // Adicionando imagem ao cliente
        this.form.get('imagem').setValue(this.imagemCliente);

        if (this.tipoPagina === 'NOVO') {
            this.pessoaService.salvar(this.form.getRawValue()).then(response => {
                this._matSnackBar.open('Cliente/Fornecedor gravado com sucesso', 'OK', {verticalPosition: 'bottom', duration: 5000});
                this.router.navigateByUrl('/cadastro/pessoa/cliente-fornecedor');
            }).catch(error => {
                this.mensagemErro = this.errorHandler.handle(error);
            }).finally(() => {
                this.carregandoDados = false;
            });
        } else {
            this.pessoaService.atualizarClienteFornecedor(this.form.getRawValue()).then(response => {
                this._matSnackBar.open('Cliente/Fornecedor atualizado com sucesso', 'OK', {verticalPosition: 'bottom', duration: 5000});
                this.router.navigateByUrl('/cadastro/pessoa/cliente-fornecedor');
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
                        this.imagemCliente = response['imagem'] ? response['imagem'] : '';
                        delete response['pessoaJuridica'];
                        this.form.patchValue(response);
                    })
                    .catch(error => {
                        console.log('CPF não encontrado, vida que segue!');
                    }).finally(() => {
                    this.carregandoDados = false;
                    this.form.updateValueAndValidity();
                });
            }
        }
    }

    buscarCnpjDigitado(): void {
        if (!this.form.get('key').value) {
            if (this.form.get('pessoaJuridica').get('cnpj').valid) {
                this.carregandoDados = true;
                this.pessoaService.buscarPorCNPJ(this.form.get('pessoaJuridica').get('cnpj').value)
                    .then(response => {
                        this.tipoPagina = 'EDICAO';
                        this.imagemCliente = response['imagem'] ? response['imagem'] : '';
                        delete response['pessoaFisica'];
                        this.form.patchValue(response);
                    })
                    .catch(error => {
                        console.log('CNPJ não encontrado, vida que segue!');
                    })
                    .finally(() => {
                        this.carregandoDados = false;
                        this.form.updateValueAndValidity();
                    });
            }
        }
    }
}
