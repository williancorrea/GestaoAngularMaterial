import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Subject} from 'rxjs';
import {Product} from '../../../e-commerce/product/product.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Location} from '@angular/common';

@Component({
    selector: 'app-fretamento-eventual-novo',
    templateUrl: './fretamento-eventual-novo.component.html',
    styleUrls: ['./fretamento-eventual-novo.component.scss']
})
export class FretamentoEventualNovoComponent implements OnInit {

    product: Product;
    pageType: string;
    productForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(private _formBuilder: FormBuilder,
                private _location: Location,
                private _matSnackBar: MatSnackBar) {
        // Set the default
        this.product = new Product();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {

    }

}
