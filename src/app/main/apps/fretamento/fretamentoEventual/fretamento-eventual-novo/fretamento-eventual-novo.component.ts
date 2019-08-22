import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '@fuse/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {FretamentoService} from '../../fretamento.service';
import {ErroManipuladorService} from '../../../../../core/erro-manipulador.service';
import {PESSOA_TIPO} from '../../../../../core/modelos/PessoaTipo';
import {FRETAMENTO_EVENTUAL_SITUACAO_ENUM} from '../../../../../core/modelos/FretamentoEventualSituacao';
import {ValidacaoGenericaWCorrea} from '../../../../../core/utils/ValidacaoGenericaWCorrea';
import {debounceTime, tap} from 'rxjs/operators';
import {environment} from '../../../../../../environments/environment';

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

    customPattern = {
        0: {pattern: new RegExp('\[0-9\]')},
        D: {pattern: new RegExp('\[0-9\]'), optional: true}
    };

    formFretamentoEventual: FormGroup;

    formCliente: FormGroup;
    formOrcamento: FormGroup;
    formDadosViagen: FormGroup;
    horizontalStepperStep3: FormGroup;

    cmbClienteForm = new FormControl();
    cmbClienteCarregando = false;
    cmbClienteLista: any;

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
            // this.fretamentoService.buscarPorKey(editando).then(response => {
            //
            //     console.log(response);
            //
            //     // this.bank = response;
            //     // this.form.patchValue(response);
            //     // this.mostrarModalCarregando(false);
            // }).catch(error => {
            //     this.errorHandler.handle(error);
            //     // this.mostrarModalCarregando(false);
            // });
        } else {
            this.tipoPagina = 'NOVO';
            // this.mostrarModalCarregando(false);
        }

        this.cmbClienteForm.setValidators([ValidacaoGenericaWCorrea.SelecionarItemCmb]);
        this.cmbClienteForm.updateValueAndValidity();
        this.cmbClienteForm.valueChanges
            .pipe(
                debounceTime(environment.comboBox.filtroDelay),
                tap(() => {
                    this.cmbClienteCarregando = true;
                })
            )
            .subscribe(pesquisa => {
                this.cmbClienteLista = [];

                console.log('OBJETO', this.cmbClienteForm)

                if (typeof pesquisa !== 'string' || pesquisa.length === 0) {
                    this.cmbClienteCarregando = false;
                    return;
                }
                this.fretamentoService.pesquisarClienteCmb(pesquisa).then(resposta => {
                    this.cmbClienteLista = resposta;
                }).catch(erro => {
                    this.errorHandler.handle(erro);
                }).finally(() => {
                    this.cmbClienteCarregando = false;
                });
            });

    }

    displayFn(obj?: any): string | undefined {
        return obj ? obj.nome : undefined;
    }

    configurarForm(): void {
        this.form = this.formBuild.group({
            key: [null],
            cliente: this.formBuild.group({
                key: [null],
                nome: [
                    null, [
                        Validators.required,
                        Validators.minLength(5),
                        Validators.maxLength(150)
                    ]
                ]
            })
        });

        this.formFretamentoEventual = this.formBuild.group({
            key: [null],
            situacao: [FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO, Validators.required]
        });

        this.formOrcamento = this.formBuild.group({
            key: [null],
            nome: ['', [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(200)]
            ],
            telefone1: ['', [Validators.required]],
            telefone2: [''],
            obs: ['']
        });

        // TODO: AJUSTAR A QUANTIDADE MAXIMA DE CADA CAMPO
        this.formCliente = this.formBuild.group({
            key: [null],
            tipoPessoa: [PESSOA_TIPO.FISICA, Validators.required],
            cpf: ['', [Validators.required, ValidacaoGenericaWCorrea.validarCPF]],
            rg: [''],
            cnpj: [''],
            inscricaoEstadual: [''],
            nomeRazao: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
            apelidoFantasia: [''],
            estado: [null],
            cidade: [null],
            endereco: [''],
            bairro: [''],
            fotoLogo: [''],
            email: ['', Validators.email],
            telefone1: ['', [Validators.required]],
            telefone1Obs: [''],
            telefone2: [''],
            telefone2Obs: [''],
            obs: ['', [Validators.maxLength(500)]]
        });

        this.formCliente.get('tipoPessoa').valueChanges.subscribe(valor => {
            if (valor === PESSOA_TIPO.JURIDICA.toString()) {
                this.formCliente.controls['cpf'].clearValidators();
                this.formCliente.controls['cnpj'].setValidators([Validators.required, ValidacaoGenericaWCorrea.validarCNPJ]);
                this.formCliente.controls['inscricaoEstadual'].setValidators([Validators.maxLength(15)]);
            } else {
                this.formCliente.controls['cpf'].setValidators([Validators.required, ValidacaoGenericaWCorrea.validarCPF]);
                this.formCliente.controls['cnpj'].clearValidators();
                this.formCliente.controls['inscricaoEstadual'].clearValidators();
            }

            this.formCliente.updateValueAndValidity(); // Forca a atualizacao do objeto
        });

        this.formDadosViagen = this.formBuild.group({
            obs: ['', [Validators.maxLength(500)]]
        });

        this.horizontalStepperStep3 = this.formBuild.group({
            city: ['', Validators.required],
            state: ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]]
        });
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    btnOrcamento(): void {
        this.formFretamentoEventual.get('situacao').setValue(FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO);
    }

    btnNovoCliente(): void {
        this.formFretamentoEventual.get('situacao').setValue(FRETAMENTO_EVENTUAL_SITUACAO_ENUM.AGENDADO);
    }

    saveProduct(): void {
        // const data = this.productForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);
        //
        // this._ecommerceProductService.saveProduct(data)
        //     .then(() => {
        //
        //         // Trigger the subscription with new data
        //         this._ecommerceProductService.onProductChanged.next(data);
        //
        //         // Show the success message
        //         this._matSnackBar.open('Product saved', 'OK', {
        //             verticalPosition: 'top',
        //             duration: 2000
        //         });
        //     });
    }

    addProduct(): void {
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

}
