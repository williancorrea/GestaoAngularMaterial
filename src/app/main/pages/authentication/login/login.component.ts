import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import {AuthService} from '../../../../seguranca/auth.service';
import {ErroManipuladorService} from '../../../../core/erro-manipulador.service';
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
                private auth: AuthService,
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
            password: ['', Validators.required]
        });
    }

    login(): void {
        console.log('email', this.loginForm.get('email').value);



        // this.loading = true;
        this.auth.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
            .then(() => {

                this.router.navigate(['/']); // Vai redirecionar para a pagina principal da aplicação (Dashboard)
                // this.loading = false;
            })
            .catch(erro => {
                // this.loading = false;
                this.errorHandler.handle(erro);
                // this.password = '';
                this.loginForm.setValue({password: ''});
            });
    }
}
