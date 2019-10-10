import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '@fuse/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {FretamentoService} from '../../../../../core/services/fretamento.service';
import {ErroManipuladorService} from '../../../../../core/componentes/erro-manipulador.service';
import {PESSOA_TIPO} from '../../../../../core/modelos/PessoaTipo';
import {FRETAMENTO_EVENTUAL_SITUACAO_ENUM} from '../../../../../core/modelos/FretamentoEventualSituacao';
import {ValidacaoGenericaWCorrea} from '../../../../../core/utils/ValidacaoGenericaWCorrea';
import {debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {environment} from '../../../../../../environments/environment';
import {Utils} from '../../../../../core/utils/Utils';
import {VeiculoService} from '../../../../../core/services/veiculo.service';
import * as moment from 'moment';
import {CidadeService} from '../../../../../core/services/cidade.service';
import {PessoaService} from '../../../../../core/services/Pessoa.service';


@Component({
    selector: 'app-fretamento-eventual-novo',
    templateUrl: './fretamento-eventual-novo.component.html',
    styleUrls: ['./fretamento-eventual-novo.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class FretamentoEventualNovoComponent implements OnInit {

    mensagemErro = '';
    carregandoDados = false;
    form: FormGroup;
    tipoPagina: string;
    env: any;

    formFretamentoEventual: FormGroup;

    cmbClienteForm = new FormControl();

    cmbCarregando = false;

    cmbClienteLista: any;
    cmbMotoristaLista: any;
    cmbCidadeLista: any;
    cmbVeiculoLista: any;
    cmbEmpresa: any;
    cmbRepresentanteComercial: any;

    viagemPrecoFinalPorcentagem: number;
    ganhoReal: number;
    formacaoPreco: any;

    imagemCliente = '';

    constructor(private _matSnackBar: MatSnackBar,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private formBuild: FormBuilder,
                private fretamentoService: FretamentoService,
                private veiculoService: VeiculoService,
                private cidadeService: CidadeService,
                private pessoaService: PessoaService,
                private errorHandler: ErroManipuladorService) {
    }

    ngOnInit(): void {
        moment.locale('pt-BR');
        this.env = environment;
        this.formacaoPreco = false;
        this.configurarForm();

        this.carregandoDados = true;
        this.pessoaService.pesquisarEmpresaRosinha().then(respostaEmpresa => {
            this.cmbEmpresa = respostaEmpresa;

            this.carregandoDados = true;
            this.pessoaService.pesquisarRepresentanteComercialEmpresaRosinha().then(respostaRepresentanteComercial => {
                this.cmbRepresentanteComercial = respostaRepresentanteComercial;

                const editando = this.activatedRoute.snapshot.params['key'];
                if (editando) {
                    this.carregandoDados = true;
                    this.tipoPagina = 'EDICAO';
                    this.fretamentoService.buscarPorKey(editando).then(response => {
                        this.formFretamentoEventual.patchValue(response);
                        this.formFretamentoEventual.updateValueAndValidity();
                        this.calcularPrevisaoChegada();
                        this.calcularDespesas();

                        if (this.formFretamentoEventual.get('situacao').value === FRETAMENTO_EVENTUAL_SITUACAO_ENUM.CONTRATADO
                            || this.formFretamentoEventual.get('situacao').value === FRETAMENTO_EVENTUAL_SITUACAO_ENUM.NAO_CONTRATADO_CONTATO
                            || this.formFretamentoEventual.get('situacao').value === FRETAMENTO_EVENTUAL_SITUACAO_ENUM.NAO_CONTRATADO_CLIENTE) {
                            this.formFretamentoEventual.disable();
                            this.cmbClienteForm.disable();
                        }

                        if (this.formFretamentoEventual.get('situacao').value !== FRETAMENTO_EVENTUAL_SITUACAO_ENUM.CONTRATADO
                            || this.formFretamentoEventual.get('situacao').value !== FRETAMENTO_EVENTUAL_SITUACAO_ENUM.NAO_CONTRATADO_CONTATO) {
                            this.imagemCliente = this.formFretamentoEventual.get('cliente').get('imagem').value ? this.formFretamentoEventual.get('cliente').get('imagem').value : '';
                        }

                    }).catch(error => {
                        this.tipoPagina = 'NOVO';
                        this.formFretamentoEventual.get('dataImpressaoContrato').setValue(moment());
                        this.mensagemErro = this.errorHandler.handle(error);
                    }).finally(() => {
                        setTimeout(() => {
                            this.carregandoDados = false;
                        }, 1000);
                    });
                } else {
                    this.tipoPagina = 'NOVO';
                    this.formFretamentoEventual.get('dataImpressaoContrato').setValue(moment());
                    this.carregandoDados = false;
                }


            }).catch(error => {
                this.mensagemErro = this.errorHandler.handle(error);
            }).finally(() => {
                this.carregandoDados = false;
            });
        }).catch(error => {
            this.mensagemErro = this.errorHandler.handle(error);
        }).finally(() => {
            this.carregandoDados = false;
        });
    }

    compararObjetosMatSelect(f1: any, f2: any): any {
        return f1 && f2 && f1.key === f2.key;
    }

    mostrarFormacaoPreco(): void {
        this.formacaoPreco = !this.formacaoPreco;
    }

    calcularPrevisaoChegada(): any {
        if (!this.formFretamentoEventual.get('itinerario').get('kmPercorridoQuantidade').value || this.formFretamentoEventual.get('itinerario').get('kmPercorridoQuantidade').value < 0

            || this.formFretamentoEventual.get('itinerario').get('partidaData').invalid || this.formFretamentoEventual.get('itinerario').get('partidaHora').invalid
            || this.formFretamentoEventual.get('itinerario').get('retornoData').invalid || this.formFretamentoEventual.get('itinerario').get('retornoHora').invalid
            || this.formFretamentoEventual.get('itinerario').get('veiculo').invalid) {
            this.formFretamentoEventual.get('itinerario').get('previsaoChegadaPartida').reset();
            this.formFretamentoEventual.get('itinerario').get('previsaoChegadaRetorno').reset();
            this.formFretamentoEventual.get('itinerario').updateValueAndValidity();
            return;
        }
        const dataPartida = this.formFretamentoEventual.get('itinerario').get('partidaData').value.format('DD-MM-YYYY') + ' ' + this.formFretamentoEventual.get('itinerario').get('partidaHora').value;
        const dataPartidaAdicionarPrevisao = (this.formFretamentoEventual.get('itinerario').get('kmPercorridoQuantidade').value / 2) / this.formFretamentoEventual.get('itinerario').get('veiculo').value['velocidadeMedia'];
        const dataPartidaPrevista = moment(dataPartida, 'DD/MM/YYYY HH:mm').add(dataPartidaAdicionarPrevisao, 'hours').format('DD/MM/YYYY HH:mm');
        this.formFretamentoEventual.get('itinerario').get('previsaoChegadaPartida').setValue(dataPartidaPrevista);

        const dataRetorno = this.formFretamentoEventual.get('itinerario').get('retornoData').value.format('DD-MM-YYYY') + ' ' + this.formFretamentoEventual.get('itinerario').get('retornoHora').value;
        const dataRetornoAdicionarPrevisao = (this.formFretamentoEventual.get('itinerario').get('kmPercorridoQuantidade').value / 2) / this.formFretamentoEventual.get('itinerario').get('veiculo').value['velocidadeMedia'];
        const dataRetornoPrevista = moment(dataRetorno, 'DD/MM/YYYY HH:mm').add(dataRetornoAdicionarPrevisao, 'hours').format('DD/MM/YYYY HH:mm');
        this.formFretamentoEventual.get('itinerario').get('previsaoChegadaRetorno').setValue(dataRetornoPrevista);
    }

    mostrarNomePessoa(obj?: any): string | undefined {
        return obj ? obj.nome : undefined;
    }

    mostrarNomeCidade(obj?: any): string | undefined {
        return obj ? obj.nome + ' / ' + obj.estado.nome : undefined;
    }

    mostrarNomeVeiculo(obj?: any): string | undefined {
        return obj ? obj.frota + ' - ' + obj.placa : undefined;
    }

    configurarForm(): void {
        this.cmbClienteForm.setValidators([ValidacaoGenericaWCorrea.SelecionarItemNaoObrigatorioCmb]);
        this.cmbClienteForm.updateValueAndValidity();
        this.cmbClienteForm.valueChanges
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
                this.cmbClienteLista = [];
                if (typeof pesquisa !== 'string') {
                    this.cmbCarregando = false;
                    return;
                }

                if (pesquisa.trim().length === 0) {
                    this.cmbCarregando = false;
                    this.cmbClienteForm.reset();
                    this.cmbClienteForm.updateValueAndValidity();
                    return;
                }

                this.pessoaService.pesquisarClienteCmb(pesquisa).then(resposta => {
                    this.cmbClienteLista = resposta;
                }).catch(error => {
                    this.mensagemErro = this.errorHandler.handle(error);
                }).finally(() => {
                    this.cmbCarregando = false;
                });
            });


        this.formFretamentoEventual = this.formBuild.group({
            key: [null],
            situacao: [FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO_CONTATO, [Validators.required]],
            situacaoData: [null],
            contato: this.formBuild.group({
                nome: [null, [
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
                kmPercorridoQuantidade: ['', [Validators.required, Validators.min(5)]],
                veiculo: [null, [Validators.required, ValidacaoGenericaWCorrea.SelecionarItemObrigatorioCmb]],
                previsaoChegadaPartida: [null],
                previsaoChegadaRetorno: [null],
                obsItineratio: ['', [Validators.maxLength(500)]],
                localSaida: ['', [Validators.required, Validators.maxLength(250)]],
                localRetorno: ['', [Validators.required, Validators.maxLength(250)]]
            }),
            custo: this.formBuild.group({
                motorista1: [null, [Validators.required, ValidacaoGenericaWCorrea.SelecionarItemObrigatorioCmb]],
                motorista2: [null, [ValidacaoGenericaWCorrea.SelecionarItemNaoObrigatorioCmb]],
                valorMotorista1Diaria: [null, [Validators.required]],
                valorMotorista2Diaria: [null],

                notaFiscalTipo: [null, [Validators.required]],
                notaFiscalImposto: [null],
                valorEstacionamento: [null],
                valorAgua: [null],
                valorGelo: [null],
                valorDespesasAdicionais: [null],
                valorDinheiroReserva: [null],
                valorPedagio: [null],

                combustivelValor: [null, [Validators.required, Validators.min(0.01)]],
                combustivelLts: [null],
                combustivelTotal: [null],

                valorHospedagem: [null],
                cobrancaAutomatica: [false, [Validators.required]],

                valorTotalDespesas: [0.00, [Validators.required]],
                viagemPrecoFinal: [0.00, [Validators.required]],
                valorKm: [null, [Validators.required]],

                obsCusto: ['', [Validators.maxLength(500)]],
            }),
            dataImpressaoContrato: ['', [Validators.required]],
            representanteComercial: [null, [Validators.required, ValidacaoGenericaWCorrea.SelecionarItemObrigatorioCmb]],
            empresa: [null, [Validators.required, ValidacaoGenericaWCorrea.SelecionarItemObrigatorioCmb]]
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
        this.formFretamentoEventual.get('custo').get('motorista2').valueChanges.subscribe(valor => {
            if ((valor && valor['key'] && valor['key'].length > 0) || (typeof valor === 'string' && valor.length > 0)) {
                this.formFretamentoEventual.get('custo').get('valorMotorista2Diaria').setValidators([Validators.required]);
            } else {
                this.formFretamentoEventual.get('custo').get('valorMotorista2Diaria').clearValidators();
            }
            this.formFretamentoEventual.get('custo').get('valorMotorista2Diaria').updateValueAndValidity();
        });
        this.formFretamentoEventual.get('custo').get('valorAgua').valueChanges.subscribe(valor => {
            if (valor > 0.00 || (valor && valor.toString() !== '')) {
                this.formFretamentoEventual.get('custo').get('valorGelo').setValidators([Validators.required]);
            } else {
                this.formFretamentoEventual.get('custo').get('valorGelo').clearValidators();
            }
            this.formFretamentoEventual.get('custo').get('valorGelo').updateValueAndValidity();
        });


        this.formFretamentoEventual.get('cliente').get('cidade').valueChanges
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

        this.formFretamentoEventual.get('itinerario').get('partidaCidade').valueChanges
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

        this.formFretamentoEventual.get('itinerario').get('retornoCidade').valueChanges
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


        this.formFretamentoEventual.get('custo').get('motorista1').valueChanges
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
                this.cmbMotoristaLista = [];
                if (typeof pesquisa !== 'string') {
                    this.cmbCarregando = false;
                    return;
                }

                this.pessoaService.pesquisarMotoristaCmb(pesquisa).then(resposta => {
                    this.cmbMotoristaLista = resposta;
                }).catch(error => {
                    this.mensagemErro = this.errorHandler.handle(error);
                }).finally(() => {
                    this.cmbCarregando = false;
                });
            });
        this.formFretamentoEventual.get('custo').get('motorista2').valueChanges
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
                this.cmbMotoristaLista = [];
                if (typeof pesquisa !== 'string') {
                    this.cmbCarregando = false;
                    return;
                }

                this.pessoaService.pesquisarMotoristaCmb(pesquisa).then(resposta => {
                    this.cmbMotoristaLista = resposta;
                }).catch(error => {
                    this.mensagemErro = this.errorHandler.handle(error);
                }).finally(() => {
                    this.cmbCarregando = false;
                });
            });

        this.formFretamentoEventual.get('itinerario').get('veiculo').valueChanges
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
                this.veiculoService.pesquisarVeiculoCmb(pesquisa).then(resposta => {
                    this.cmbVeiculoLista = resposta;
                }).catch(error => {
                    this.mensagemErro = this.errorHandler.handle(error);
                }).finally(() => {
                    this.cmbCarregando = false;
                });
            });
    }

    selecionandoUmCliente(event: MatAutocompleteSelectedEvent): void {
        if (event && event.option && event.option.value) {
            const clone = Utils.clonarObjeto(event.option.value);

            this.formFretamentoEventual.get('situacao').setValue(FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO_CLIENTE);
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
        this.carregandoDados = true;

        this.formFretamentoEventual.get('situacao').setValue(FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO_CONTATO);

        this.formFretamentoEventual.get('contato').get('nome').setValue('');
        this.formFretamentoEventual.get('contato').get('telefone1').setValue('');
        this.formFretamentoEventual.get('contato').get('telefone2').setValue('');
        this.formFretamentoEventual.get('contato').get('obs').setValue('');

        this.formFretamentoEventual.get('contato').reset(this.formFretamentoEventual.get('cliente').value);
        this.formFretamentoEventual.get('contato').updateValueAndValidity();

        this.imagemCliente = '';

        this.cmbClienteForm.reset();
        this.cmbClienteForm.updateValueAndValidity();

        setTimeout(() => {
            this.carregandoDados = false;
        }, 1000);
    }

    btnNovoCliente(): void {
        this.carregandoDados = true;
        this.formFretamentoEventual.get('situacao').setValue(FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO_CLIENTE);

        this.cmbClienteForm.reset();
        this.cmbClienteForm.updateValueAndValidity();

        this.formFretamentoEventual.get('cliente').reset(this.formFretamentoEventual.get('contato').value);
        this.formFretamentoEventual.get('cliente').get('tipo').setValue(PESSOA_TIPO.FISICA);
        this.formFretamentoEventual.get('cliente').updateValueAndValidity();

        this.formFretamentoEventual.get('contato').reset();
        this.formFretamentoEventual.get('contato').updateValueAndValidity();

        setTimeout(() => {
            this.carregandoDados = false;
        }, 1000);
    }

    gravarFretamento(): void {
        this.carregandoDados = true;

        // Adicionando imagem ao cliente
        if (this.formFretamentoEventual.get('situacao').value !== FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO_CONTATO || this.formFretamentoEventual.get('situacao').value !== FRETAMENTO_EVENTUAL_SITUACAO_ENUM.NAO_CONTRATADO_CONTATO) {
            this.formFretamentoEventual.get('cliente').get('imagem').setValue(this.imagemCliente);
        }

        if (this.tipoPagina === 'NOVO') {
            this.fretamentoService.salvar(this.formFretamentoEventual.getRawValue()).then(response => {
                this._matSnackBar.open('Fretamento gravado com sucesso', 'OK', {verticalPosition: 'bottom', duration: 5000});

                this.router.navigateByUrl('/fretamento/eventual');
            }).catch(error => {
                this.mensagemErro = this.errorHandler.handle(error);
            }).finally(() => {
                this.carregandoDados = false;
            });
        } else {
            this.fretamentoService.atualizar(this.formFretamentoEventual.getRawValue()).then(response => {
                this._matSnackBar.open('Fretamento atualizado com sucesso', 'OK', {verticalPosition: 'bottom', duration: 5000});

                this.router.navigateByUrl('/fretamento/eventual');
            }).catch(error => {
                this.mensagemErro = this.errorHandler.handle(error);
            }).finally(() => {
                this.carregandoDados = false;
            });
        }
    }

    calcularDespesas(): void {
        let totalDespesas = 0;
        totalDespesas += this.formFretamentoEventual.get('custo').get('valorMotorista1Diaria').value ? this.formFretamentoEventual.get('custo').get('valorMotorista1Diaria').value : 0.0;
        totalDespesas += this.formFretamentoEventual.get('custo').get('valorMotorista2Diaria').value ? this.formFretamentoEventual.get('custo').get('valorMotorista2Diaria').value : 0.0;
        totalDespesas += this.formFretamentoEventual.get('custo').get('valorEstacionamento').value ? this.formFretamentoEventual.get('custo').get('valorEstacionamento').value : 0.0;
        totalDespesas += this.formFretamentoEventual.get('custo').get('valorGelo').value ? this.formFretamentoEventual.get('custo').get('valorGelo').value : 0.0;
        totalDespesas += this.formFretamentoEventual.get('custo').get('valorAgua').value ? this.formFretamentoEventual.get('custo').get('valorAgua').value : 0.0;
        totalDespesas += this.formFretamentoEventual.get('custo').get('valorDespesasAdicionais').value ? this.formFretamentoEventual.get('custo').get('valorDespesasAdicionais').value : 0.0;
        totalDespesas += this.formFretamentoEventual.get('custo').get('valorPedagio').value ? this.formFretamentoEventual.get('custo').get('valorPedagio').value : 0.0;
        totalDespesas += this.formFretamentoEventual.get('custo').get('valorHospedagem').value ? this.formFretamentoEventual.get('custo').get('valorHospedagem').value : 0.0;

        // Calculo dos combustivel
        this.formFretamentoEventual.get('custo').get('combustivelLts').setValue(this.formFretamentoEventual.get('itinerario').get('kmPercorridoQuantidade').value / this.formFretamentoEventual.get('itinerario').get('veiculo').value['consumoReal']);
        if (this.formFretamentoEventual.get('custo').get('combustivelValor').value && this.formFretamentoEventual.get('custo').get('combustivelValor').value > 0.0) {
            this.formFretamentoEventual.get('custo').get('combustivelTotal').setValue(
                this.formFretamentoEventual.get('custo').get('combustivelLts').value * this.formFretamentoEventual.get('custo').get('combustivelValor').value
            );
        } else {
            this.formFretamentoEventual.get('custo').get('combustivelValor').setValue(0.0);
            this.formFretamentoEventual.get('custo').get('combustivelTotal').setValue(0.0);
        }
        totalDespesas += this.formFretamentoEventual.get('custo').get('combustivelTotal').value;

        // Total de despesas
        this.formFretamentoEventual.get('custo').get('valorTotalDespesas').setValue(totalDespesas);

        // Caso o preço ja exista ele vai pegar se nao vai colocar zero
        this.formFretamentoEventual.get('custo').get('viagemPrecoFinal').setValue(
            this.formFretamentoEventual.get('custo').get('viagemPrecoFinal').value ? this.formFretamentoEventual.get('custo').get('viagemPrecoFinal').value : 0.0
        );


        // FAZ O CALCULO DO TIPO DE NOTA FISCAL
        switch (this.formFretamentoEventual.get('custo').get('notaFiscalTipo').value) {
            case 'SEM_NOTA':
                this.formFretamentoEventual.get('custo').get('notaFiscalImposto').setValue(0.0);
                break;
            case 'NOTA_SERVICO':
                this.formFretamentoEventual.get('custo').get('notaFiscalImposto').setValue((this.env.imposto.nfe / 100) * this.formFretamentoEventual.get('custo').get('viagemPrecoFinal').value);
                break;
            case 'CTE_OS':
                this.formFretamentoEventual.get('custo').get('notaFiscalImposto').setValue((this.env.imposto.cteos / 100) * this.formFretamentoEventual.get('custo').get('viagemPrecoFinal').value);
                break;
        }

        this.ganhoReal = this.formFretamentoEventual.get('custo').get('viagemPrecoFinal').value - this.formFretamentoEventual.get('custo').get('valorTotalDespesas').value - this.formFretamentoEventual.get('custo').get('notaFiscalImposto').value;
        this.viagemPrecoFinalPorcentagem = ((this.formFretamentoEventual.get('custo').get('viagemPrecoFinal').value / this.formFretamentoEventual.get('custo').get('valorTotalDespesas').value) * 100) - 100;
        this.formFretamentoEventual.get('custo').get('valorKm').setValue(
            this.formFretamentoEventual.get('custo').get('viagemPrecoFinal').value > 0.01 ?
                (this.formFretamentoEventual.get('custo').get('viagemPrecoFinal').value / this.formFretamentoEventual.get('itinerario').get('kmPercorridoQuantidade').value) : 0.00
        );

        this.formFretamentoEventual.get('custo').updateValueAndValidity();
    }

    calcularViagemPrecoFinalPorcentagem(): void {
        this.formFretamentoEventual.get('custo').get('viagemPrecoFinal').setValue(
            ((this.viagemPrecoFinalPorcentagem / 100) * this.formFretamentoEventual.get('custo').get('valorTotalDespesas').value) + this.formFretamentoEventual.get('custo').get('valorTotalDespesas').value
        );
        this.calcularDespesas();
    }

    calcularViagemKmRodado(): void {
        this.formFretamentoEventual.get('custo').get('viagemPrecoFinal').setValue(
            this.formFretamentoEventual.get('custo').get('valorKm').value * this.formFretamentoEventual.get('itinerario').get('kmPercorridoQuantidade').value
        );
        this.calcularDespesas();
    }

    buscarCpfDigitado(): void {
        if (!this.formFretamentoEventual.get('cliente').get('key').value) {
            if (this.formFretamentoEventual.get('cliente').get('pessoaFisica').get('cpf').valid) {
                this.carregandoDados = true;
                this.pessoaService.buscarPorCPF(this.formFretamentoEventual.get('cliente').get('pessoaFisica').get('cpf').value)
                    .then(response => {
                        this.formFretamentoEventual.get('cliente').patchValue(response);
                    })
                    .catch(error => {
                        console.log('CPF não encontrado, vida que segue!');
                    }).finally(() => {
                    this.carregandoDados = false;
                });
            }
        }
    }

    buscarCnpjDigitado(): void {
        if (!this.formFretamentoEventual.get('cliente').get('key').value) {
            if (this.formFretamentoEventual.get('cliente').get('pessoaJuridica').get('cnpj').valid) {
                this.carregandoDados = true;
                this.pessoaService.buscarPorCNPJ(this.formFretamentoEventual.get('cliente').get('pessoaJuridica').get('cnpj').value)
                    .then(response => {
                        this.formFretamentoEventual.get('cliente').patchValue(response);
                    })
                    .catch(error => {
                        console.log('CNPJ não encontrado, vida que segue!');
                    })
                    .finally(() => {
                        this.carregandoDados = false;
                    });
            }
        }
    }
}
