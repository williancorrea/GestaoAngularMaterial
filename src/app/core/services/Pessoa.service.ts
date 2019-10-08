import {ElementRef, Injectable} from '@angular/core';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {GestaoService} from '../../seguranca/autenticacao/gestao.service';
import {environment} from '../../../environments/environment';

import * as moment from 'moment';
import {MatPaginator} from '@angular/material';


@Injectable()
export class PessoaService {

    apiUrl: string;

    constructor(private http: GestaoService) {
        this.apiUrl = `${environment.apiUrl}/pessoas`;
        moment.locale('pt-BR');
    }

    listarTodosMotoristas(paginador: MatPaginator, filtro: ElementRef): Promise<any> {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');


        const httpParams = new HttpParams()
            .set('size', paginador.pageSize.toString())
            .set('page', paginador.pageIndex.toString())
            .set('filtroGlobal', filtro.nativeElement.value && filtro.nativeElement.value.length > 0 ? filtro.nativeElement.value.trim() : '')
            .set('ordemClassificacao', 'ASC')
            .set('campoOrdenacao', 'nome')
            .set('motorista',  Boolean(true).toString());

        return this.http.get(`${this.apiUrl}`, {params: httpParams, headers: headers})
            .toPromise()
            .then(response => {

                const lista = response;
                for (let i = 0; i < response['content']['length']; i++) {
                    lista['content'][i] = (this.prepararDadosParaReceber(response['content'][i]));
                }
                return lista;
            });
    }

    private prepararDadosParaSalvar(clone: any, obj: any): any {

        return clone;
    }

    private prepararDadosParaReceber(response: any): any {

        return response;
    }

    // buscarPorKey(key): any {
    //     // TODO: REmover a autenticacao FIXA DAQUI
    //     const headers = new HttpHeaders();
    //     headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
    //     headers.append('Content-Type', 'application/json');
    //
    //     return this.http.get(`${this.apiUrl}/${key}`, {headers})
    //         .toPromise()
    //         .then(response => {
    //             return response;
    //         });
    // }

    // pesquisarVeiculoCmb(pesquisa: string): Promise<any> {
    //     const headers = new HttpHeaders();
    //     headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
    //     headers.append('Content-Type', 'application/json');
    //
    //     const params = new HttpParams()
    //         .set('size', String(environment.comboBox.linhas))
    //         .set('page', String(0))
    //         .set('ordemClassificacao', 'ASC')
    //         .set('campoOrdenacao', 'frota')
    //         .set('filtroGlobal', pesquisa && pesquisa.trim().length > 0 ? pesquisa.trim() : '');
    //
    //     return this.http.get(`${this.apiUrl}/cmb`, {headers: headers, params: params}).toPromise().then(response => {
    //         return response;
    //     });
    // }

}
