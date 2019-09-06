import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '@fuse/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {FretamentoService} from '../../fretamento.service';
import {ErroManipuladorService} from '../../../../../core/erro-manipulador.service';
import {PESSOA_TIPO} from '../../../../../core/modelos/PessoaTipo';
import {FRETAMENTO_EVENTUAL_SITUACAO_ENUM} from '../../../../../core/modelos/FretamentoEventualSituacao';
import {ValidacaoGenericaWCorrea} from '../../../../../core/utils/ValidacaoGenericaWCorrea';
import {debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {environment} from '../../../../../../environments/environment';
import {Utils} from '../../../../../core/utils/Utils';

@Component({
    selector: 'app-fretamento-eventual-novo',
    templateUrl: './fretamento-eventual-novo.component.html',
    styleUrls: ['./fretamento-eventual-novo.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class FretamentoEventualNovoComponent implements OnInit {

    form: FormGroup;
    tipoPagina: string;

    formFretamentoEventual: FormGroup;

    horizontalStepperStep3: FormGroup;

    cmbClienteForm = new FormControl();
    cmbClienteCarregando = false;
    cmbClienteLista: any;

    cmbCidadeCarregando = false;
    cmbCidadeLista: any;

    constructor(
        private _matSnackBar: MatSnackBar,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private formBuild: FormBuilder,
        private fretamentoService: FretamentoService,
        private errorHandler: ErroManipuladorService
    ) {
    }

    ngOnInit(): void {
        this.configurarForm();

        const editando = this.activatedRoute.snapshot.params['key'];
        if (editando) {
            this.tipoPagina = 'EDICAO';
            this.fretamentoService.buscarPorKey(editando).then(response => {

                console.log(response);
                this.formFretamentoEventual.patchValue(response);
                // this.mostrarModalCarregando(false);
            }).catch(error => {
                // this.errorHandler.handle(error);
                // this.mostrarModalCarregando(false);
            });
        } else {
            this.tipoPagina = 'NOVO';
            // this.mostrarModalCarregando(false);
        }


    }

    mostrarNomeCliente(obj?: any): string | undefined {
        return obj ? obj.nome : undefined;
    }

    mostrarNomeCidade(obj?: any): string | undefined {
        return obj ? obj.nome + ' / ' + obj.estado.nome : undefined;
    }

    configurarForm(): void {
        this.cmbClienteForm.setValidators([ValidacaoGenericaWCorrea.SelecionarItemCmb]);
        this.cmbClienteForm.updateValueAndValidity();
        this.cmbClienteForm.valueChanges
            .pipe(
                debounceTime(environment.comboBox.filtroDelay),
                map(pesquisa => {
                    if (typeof pesquisa === 'string') {
                        return pesquisa.trim();
                    }
                }),
                distinctUntilChanged(),
                tap(pesquisa => {
                    this.cmbClienteCarregando = true;
                })
            )
            .subscribe(pesquisa => {
                this.cmbClienteLista = [];
                if (typeof pesquisa !== 'string') {
                    this.cmbClienteCarregando = false;
                    return;
                }

                if (pesquisa.trim().length === 0) {
                    this.cmbClienteCarregando = false;
                    this.cmbClienteForm.reset();
                    this.cmbClienteForm.updateValueAndValidity();
                    return;
                }

                this.fretamentoService.pesquisarClienteCmb(pesquisa).then(resposta => {
                    this.cmbClienteLista = resposta;
                }).catch(erro => {
                    // TODO: ARRUMAR O REDIRECIONAMENTO QUANDO DAR ERRO NA CONSULTA, APRESENTAR UMA MENSAGEM DE ERRO PARA O USUARIO
                    this.errorHandler.handle(erro);
                }).finally(() => {
                    this.cmbClienteCarregando = false;
                });
            });


        this.formFretamentoEventual = this.formBuild.group({
            key: [null],
            situacao: [FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO, [Validators.required]],
            contato: this.formBuild.group({
                nome: ['', [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(200)]
                ],
                telefone1: ['', [Validators.required]],
                telefone2: [''],
                obs: ['', [Validators.maxLength(500)]]
            }),
            cliente: this.formBuild.group({
                key: [null],
                tipo: [PESSOA_TIPO.FISICA, Validators.required],
                email: ['', Validators.email],
                obs: ['', [Validators.maxLength(500)]],
                nome: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
                fantasia: ['', [Validators.maxLength(250)]],
                imagem: [''],
                cidade: [null, [Validators.required, ValidacaoGenericaWCorrea.SelecionarItemObrigatorioCmb]],
                cep: ['', [Validators.maxLength(9)]],
                endereco: [''],
                bairro: [''],
                telefone1: ['', [Validators.required]],
                telefone1Obs: [''],
                telefone2: [''],
                telefone2Obs: [''],
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
            }),
            itinerario: this.formBuild.group({
                partidaCidade: [null, [Validators.required, ValidacaoGenericaWCorrea.SelecionarItemObrigatorioCmb]],
                partidaData: ['', [Validators.required]],
                partidaHora: ['', [Validators.required, Validators.pattern('^([01]\\d|2[0-3]):?([0-5]\\d)$')]],
                retornoCidade: [null, [Validators.required, ValidacaoGenericaWCorrea.SelecionarItemObrigatorioCmb]],
                retornoData: ['', [Validators.required]],
                retornoHora: ['', [Validators.required, Validators.pattern('^([01]\\d|2[0-3]):?([0-5]\\d)$')]],
                obsItineratio: ['', [Validators.maxLength(500)]],
            })
        });

        this.formFretamentoEventual.get('cliente').get('tipo').valueChanges.subscribe(valor => {
            if (valor === PESSOA_TIPO.JURIDICA.toString()) {
                this.formFretamentoEventual.get('cliente').get('pessoaFisica').get('cpf').clearValidators();
                this.formFretamentoEventual.get('cliente').get('pessoaJuridica').get('cnpj').setValidators([Validators.required, ValidacaoGenericaWCorrea.validarCNPJ]);
                this.formFretamentoEventual.get('cliente').get('pessoaJuridica').get('inscricaoEstadual').setValidators([Validators.maxLength(15)]);
            } else {
                this.formFretamentoEventual.get('cliente').get('pessoaFisica').get('cpf').setValidators([Validators.required, ValidacaoGenericaWCorrea.validarCPF]);
                this.formFretamentoEventual.get('cliente').get('pessoaJuridica').get('cnpj').clearValidators();
                this.formFretamentoEventual.get('cliente').get('pessoaJuridica').get('inscricaoEstadual').clearValidators();
            }

            // DESABILITAR A EDICAO DO CPF E CNPJ
            setTimeout(() => {
                if (this.formFretamentoEventual.get('cliente').get('key').value) {
                    this.formFretamentoEventual.get('cliente').get('pessoaFisica').get('cpf').disable();
                    this.formFretamentoEventual.get('cliente').get('pessoaJuridica').get('cnpj').disable();
                } else {
                    this.formFretamentoEventual.get('cliente').get('pessoaFisica').get('cpf').enable();
                    this.formFretamentoEventual.get('cliente').get('pessoaJuridica').get('cnpj').enable();
                }
            });
            this.formFretamentoEventual.get('cliente').updateValueAndValidity(); // Forca a atualizacao do objeto
            this.formFretamentoEventual.get('cliente').get('pessoaFisica').updateValueAndValidity(); // Forca a atualizacao do objeto
            this.formFretamentoEventual.get('cliente').get('pessoaJuridica').updateValueAndValidity(); // Forca a atualizacao do objeto
        });

        this.formFretamentoEventual.get('cliente').get('cidade').valueChanges
            .pipe(
                debounceTime(environment.comboBox.filtroDelay),
                map(pesquisa => {
                    if (typeof pesquisa === 'string') {
                        return pesquisa.trim();
                    }
                }),
                distinctUntilChanged(),
                tap(pesquisa => {
                    this.cmbCidadeCarregando = true;
                })
            )
            .subscribe(pesquisa => {
                this.cmbCidadeLista = [];
                if (typeof pesquisa !== 'string') {
                    this.cmbCidadeCarregando = false;
                    return;
                }

                this.fretamentoService.pesquisarCidadeCmb(pesquisa).then(resposta => {
                    this.cmbCidadeLista = resposta;
                }).catch(erro => {
                    // TODO: ARRUMAR O REDIRECIONAMENTO QUANDO DAR ERRO NA CONSULTA, APRESENTAR UMA MENSAGEM DE ERRO PARA O USUARIO
                    this.errorHandler.handle(erro);
                }).finally(() => {
                    this.cmbCidadeCarregando = false;
                });
            });

        this.formFretamentoEventual.get('itinerario').get('partidaCidade').valueChanges
            .pipe(
                debounceTime(environment.comboBox.filtroDelay),
                map(pesquisa => {
                    if (typeof pesquisa === 'string') {
                        return pesquisa.trim();
                    }
                }),
                distinctUntilChanged(),
                tap(pesquisa => {
                    this.cmbCidadeCarregando = true;
                })
            )
            .subscribe(pesquisa => {
                this.cmbCidadeLista = [];
                if (typeof pesquisa !== 'string') {
                    this.cmbCidadeCarregando = false;
                    return;
                }

                this.fretamentoService.pesquisarCidadeCmb(pesquisa).then(resposta => {
                    this.cmbCidadeLista = resposta;
                }).catch(erro => {
                    // TODO: ARRUMAR O REDIRECIONAMENTO QUANDO DAR ERRO NA CONSULTA, APRESENTAR UMA MENSAGEM DE ERRO PARA O USUARIO
                    this.errorHandler.handle(erro);
                }).finally(() => {
                    this.cmbCidadeCarregando = false;
                });
            });

        this.formFretamentoEventual.get('itinerario').get('retornoCidade').valueChanges
            .pipe(
                debounceTime(environment.comboBox.filtroDelay),
                map(pesquisa => {
                    if (typeof pesquisa === 'string') {
                        return pesquisa.trim();
                    }
                }),
                distinctUntilChanged(),
                tap(pesquisa => {
                    this.cmbCidadeCarregando = true;
                })
            )
            .subscribe(pesquisa => {
                this.cmbCidadeLista = [];
                if (typeof pesquisa !== 'string') {
                    this.cmbCidadeCarregando = false;
                    return;
                }

                this.fretamentoService.pesquisarCidadeCmb(pesquisa).then(resposta => {
                    this.cmbCidadeLista = resposta;
                }).catch(erro => {
                    // TODO: ARRUMAR O REDIRECIONAMENTO QUANDO DAR ERRO NA CONSULTA, APRESENTAR UMA MENSAGEM DE ERRO PARA O USUARIO
                    this.errorHandler.handle(erro);
                }).finally(() => {
                    this.cmbCidadeCarregando = false;
                });
            });


        this.horizontalStepperStep3 = this.formBuild.group({
            city: ['', Validators.required],
            state: ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]]
        });
    }

    selecionandoUmCliente(event: MatAutocompleteSelectedEvent): void {
        if (event && event.option && event.option.value) {
            const clone = Utils.clonarObjeto(event.option.value);

            this.formFretamentoEventual.get('situacao').setValue(FRETAMENTO_EVENTUAL_SITUACAO_ENUM.AGENDADO);
            this.formFretamentoEventual.get('cliente').get('tipo').setValue(clone['tipo']);

            if (clone['tipo'] === PESSOA_TIPO.FISICA) {
                delete clone['pessoaJuridica'];
            } else {
                delete clone['pessoaFisica'];
            }
            this.formFretamentoEventual.get('cliente').patchValue(clone);

            this.cmbClienteForm.reset();
            this.cmbClienteForm.updateValueAndValidity();
        }
    }

    btnOrcamento(): void {
        this.formFretamentoEventual.get('situacao').setValue(FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO);

        this.formFretamentoEventual.get('contato').get('nome').setValue('');
        this.formFretamentoEventual.get('contato').get('telefone1').setValue('');
        this.formFretamentoEventual.get('contato').get('telefone2').setValue('');
        this.formFretamentoEventual.get('contato').get('obs').setValue('');

        this.formFretamentoEventual.get('contato').reset(this.formFretamentoEventual.get('cliente').value);
        this.formFretamentoEventual.get('contato').updateValueAndValidity();

        this.cmbClienteForm.reset();
        this.cmbClienteForm.updateValueAndValidity();
    }

    btnNovoCliente(): void {
        this.formFretamentoEventual.get('situacao').setValue(FRETAMENTO_EVENTUAL_SITUACAO_ENUM.AGENDADO);

        this.cmbClienteForm.reset();
        this.cmbClienteForm.updateValueAndValidity();

        this.formFretamentoEventual.get('cliente').reset(this.formFretamentoEventual.get('contato').value);
        this.formFretamentoEventual.get('cliente').get('tipo').setValue(PESSOA_TIPO.FISICA);
        this.formFretamentoEventual.get('cliente').updateValueAndValidity();
    }

    gravarFretamento(): void {
        // console.log('CONTROLE', this.formFretamentoEventual);
        console.log('DADOS', this.formFretamentoEventual.getRawValue());

        if (this.formFretamentoEventual.get('situacao').value !== FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO) {
            this.formFretamentoEventual.get('contato').reset();
        } else {
            this.formFretamentoEventual.get('cliente').reset();
        }

        this.fretamentoService.salvar(this.formFretamentoEventual.getRawValue()).then(response => {
            this._matSnackBar.open('Fretamento gravado com sucesso', 'OK', {
                verticalPosition: 'bottom',
                duration: 5000
            });
        }).catch(error => {
            // TODO: Colocar mensagem de erro para o usuario
            console.log('ERRO AO SALVAR: ', error);
            // this.errorHandler.handle(error);
        });


        // const data = this.productForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);
        //
        // this._ecommerceProductService.addProduct(data)
        //     .then(() => {
        //
        //         // Trigger the subscription with new data
        //         this._ecommerceProductService.onProductChanged.next(data);
        //
        //         // Show the success message
        //         this._matSnackBar.open('Product added', 'OK', {
        //             verticalPosition: 'top',
        //             duration: 2000
        //         });
        //
        //         // Change the location with new one
        //         this._location.go('apps/e-commerce/products/' + this.product.id + '/' + this.product.handle);
        //     });
    }



    buscarCpfDigitado(): void {
        if (this.formFretamentoEventual.get('cliente').get('pessoaFisica').get('cpf').valid) {
            this.fretamentoService.buscarPorCPF(this.formFretamentoEventual.get('cliente').get('pessoaFisica').get('cpf').value)
                .then(response => {
                    this.formFretamentoEventual.get('cliente').patchValue(response);
                })
                .catch(error => {
                    console.log('CPF não encontrado, vida que segue!');
                });
        }
    }

    buscarCnpjDigitado(): void {
        if (this.formFretamentoEventual.get('cliente').get('pessoaJuridica').get('cnpj').valid) {
            this.fretamentoService.buscarPorCNPJ(this.formFretamentoEventual.get('cliente').get('pessoaJuridica').get('cnpj').value)
                .then(response => {
                    this.formFretamentoEventual.get('cliente').patchValue(response);
                })
                .catch(error => {
                    console.log('CNPJ não encontrado, vida que segue!');
                });
        }
    }
}
