import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import {ErroManipuladorService} from '../../../../core/componentes/erro-manipulador.service';
import {Router} from '@angular/router';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(private _fuseConfigService: FuseConfigService,
                private _formBuilder: FormBuilder,
                private errorHandler: ErroManipuladorService,
                private router: Router) {

        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {hidden: true},
                toolbar: {hidden: true},
                footer: {hidden: true},
                sidepanel: {hidden: true}
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [
                Validators.minLength(5),
                Validators.required,
                Validators.email
            ]],
            password: ['', Validators.required, Validators.minLength(3)]
        });
    }

    login(): void {
    }
}
