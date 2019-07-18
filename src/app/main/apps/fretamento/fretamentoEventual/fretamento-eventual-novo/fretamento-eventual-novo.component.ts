import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '@fuse/animations';
import {ActivatedRoute, Router} from '@angular/router';

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


    constructor(
        private _matSnackBar: MatSnackBar,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        // private translateService: TranslateService,
        // private titulo: Title,
        // private bankService: BancoService,
        // private toasty: MessageService,
        // public auth: AuthService,
        // private errorHandler: ErroManipuladorService,
        private formBuild: FormBuilder) {

    }

    ngOnInit(): void {
        this.configurarForm();

        const editando = this.activatedRoute.snapshot.params['key'];
        if (editando) {
            this.tipoPagina = 'EDICAO';
            // this.titulo.setTitle(this.traduzir['banco']['acoes']['editar']);

            // this.bankService.findOne(editando).then(response => {
            //     // this.bank = response;
            //     this.form.patchValue(response);
            //     this.mostrarModalCarregando(false);
            // }).catch(error => {
            //     this.errorHandler.handle(error);
            //     this.titulo.setTitle(this.traduzir['banco']['acoes']['adicionar']);
            //     this.mostrarModalCarregando(false);
            // });
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
