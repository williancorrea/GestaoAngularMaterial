import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '@fuse/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {FretamentoService} from '../../fretamento.service';
import {ErroManipuladorService} from '../../../../../core/erro-manipulador.service';
import {AuthService} from '../../../../../seguranca/auth.service';
import {PessoaTipo} from '../../../../../core/modelos/PessoaTipo';

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

    formCliente: FormGroup;
    horizontalStepperStep2: FormGroup;
    horizontalStepperStep3: FormGroup;

    constructor(
        private _matSnackBar: MatSnackBar,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private formBuild: FormBuilder,
        private fretamentoService: FretamentoService,
        public auth: AuthService,
        private errorHandler: ErroManipuladorService
    ) {
    }

    ngOnInit(): void {
        this.configurarForm();

        const editando = this.activatedRoute.snapshot.params['key'];
        if (editando) {
            this.tipoPagina = 'EDICAO';
            this.fretamentoService.buscarPorKey(editando).then(response => {
                // this.bank = response;
                this.form.patchValue(response);
                // this.mostrarModalCarregando(false);
            }).catch(error => {
                this.errorHandler.handle(error);
                // this.mostrarModalCarregando(false);
            });
        } else {
            this.tipoPagina = 'NOVO';
            // this.titulo.setTitle(this.traduzir['banco']['acoes']['adicionar']);
            // this.mostrarModalCarregando(false);
        }
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


        // TODO: AJUSTAR A QUANTIDADE MAXIMA DE CADA CAMPO
        this.formCliente = this.formBuild.group({
            key: [null],
            tipoPessoa: [PessoaTipo.FISICA, Validators.required],
            cpf: ['', Validators.required],
            rg: [''],
            cnpj: ['', Validators.required],
            inscricaoEstadual: ['',[Validators.required]],
            nomeRazao: ['', [Validators.required, Validators.minLength(10)]],
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
            if (valor === PessoaTipo.JURIDICA) {
                this.formCliente.get('cpf').setValidators(null);
                this.formCliente.get('cnpj').setValidators([Validators.required]);
            } else {
                this.formCliente.get('cpf').setValidators([Validators.required]);
                this.formCliente.get('cnpj').setValidators(null);
            }
            this.formCliente.updateValueAndValidity();
        });


        this.horizontalStepperStep2 = this.formBuild.group({
            address: ['', Validators.required]
        });

        this.horizontalStepperStep3 = this.formBuild.group({
            city: ['', Validators.required],
            state: ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]]
        });
    }

    /**
     * Save product
     */
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

    /**
     * Create product form
     *
     * @returns {FormGroup}
     */
    // createProductForm(): FormGroup {
    //     return this._formBuilder.group({
    //         id: [this.product.id],
    //         name: [this.product.name],
    //         handle: [this.product.handle],
    //         description: [this.product.description],
    //         categories: [this.product.categories],
    //         tags: [this.product.tags],
    //         images: [this.product.images],
    //         priceTaxExcl: [this.product.priceTaxExcl],
    //         priceTaxIncl: [this.product.priceTaxIncl],
    //         taxRate: [this.product.taxRate],
    //         comparedPrice: [this.product.comparedPrice],
    //         quantity: [this.product.quantity],
    //         sku: [this.product.sku],
    //         width: [this.product.width],
    //         height: [this.product.height],
    //         depth: [this.product.depth],
    //         weight: [this.product.weight],
    //         extraShippingFee: [this.product.extraShippingFee],
    //         active: [this.product.active]
    //         // });
    //     }
    // }

    /**
     * Add product
     */
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
