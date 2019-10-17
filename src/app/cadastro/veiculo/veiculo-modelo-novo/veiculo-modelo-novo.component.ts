import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {ErroManipuladorService} from '../../../core/componentes/erro-manipulador.service';
import * as moment from 'moment';
import {environment} from '../../../../environments/environment';
import {VeiculoModeloService} from '../../../core/services/veiculoModelo.service';

@Component({
    selector: 'app-veiculo-modelo-novo',
    templateUrl: './veiculo-modelo-novo.component.html',
    styleUrls: ['./veiculo-modelo-novo.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class VeiculoModeloNovoComponent implements OnInit {

    mensagemErro = '';
    mensagemAlerta = '';
    carregandoDados = false;
    form: FormGroup;
    tipoPagina: string;
    env: any;

    @ViewChild('conteudoScroll', {static: true}) conteudoScroll: ElementRef;

    constructor(private _matSnackBar: MatSnackBar,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private formBuild: FormBuilder,
                private veiculoModeloService: VeiculoModeloService,
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
            this.veiculoModeloService.buscarPorKey(editando).then(response => {
                this.form.patchValue(response);
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

    mostrarNome(obj?: any): string | undefined {
        return obj ? obj.nome : undefined;
    }

    configurarForm(): void {
        this.form = this.formBuild.group({
            key: [null],
            nome: ['', [Validators.required, Validators.maxLength(100)]],
            inativo: [false]
        });
    }

    gravar(): void {
        this.carregandoDados = true;
        this.mensagemAlerta = '';

        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();

        if (this.form.invalid) {
            this.conteudoScroll.nativeElement.scrollTop = 0;
            this.mensagemAlerta = 'Formulário não está preenchido corretamente, verifique..';
            this.carregandoDados = false;
            return;
        }

        if (this.tipoPagina === 'NOVO') {
            this.veiculoModeloService.salvar(this.form.getRawValue()).then(response => {
                this._matSnackBar.open('Modelo/Carroceria gravado com sucesso', 'OK', {verticalPosition: 'bottom', duration: 5000});
                this.router.navigateByUrl('/cadastro/veiculo/modelo');
            }).catch(error => {
                this.mensagemErro = this.errorHandler.handle(error);
            }).finally(() => {
                this.carregandoDados = false;
            });
        } else {
            this.veiculoModeloService.atualizar(this.form.getRawValue()).then(response => {
                this._matSnackBar.open('Modelo/Carroceria atualizado com sucesso', 'OK', {verticalPosition: 'bottom', duration: 5000});
                this.router.navigateByUrl('/cadastro/veiculo/modelo');
            }).catch(error => {
                this.mensagemErro = this.errorHandler.handle(error);
            }).finally(() => {
                this.carregandoDados = false;
            });
        }
    }
}
