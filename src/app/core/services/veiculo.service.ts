import {ElementRef, Injectable} from '@angular/core';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {GestaoService} from '../../seguranca/autenticacao/gestao.service';
import {environment} from '../../../environments/environment';

import * as moment from 'moment';
import {MatPaginator} from '@angular/material';


@Injectable()
export class VeiculoService {

    apiUrl: string;

    constructor(private http: GestaoService) {
        this.apiUrl = `${environment.apiUrl}/veiculos`;
        moment.locale('pt-BR');
    }

    listar(paginador: MatPaginator, filtro: ElementRef): Promise<any> {
        // TODO: REmover a autenticacao FIXA DAQUI

        const httpParams = new HttpParams()
            .set('size', paginador.pageSize.toString())
            .set('page', paginador.pageIndex.toString())
            .set('filtroGlobal', filtro.nativeElement.value && filtro.nativeElement.value.length > 0 ? filtro.nativeElement.value.trim() : '')
            .set('ordemClassificacao', 'ASC')
            .set('campoOrdenacao', 'frota');


        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

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

    pesquisarVeiculoCmbFretamento(pesquisa: string): Promise<any> {
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('size', String(environment.comboBox.linhas))
            .set('page', String(0))
            .set('ordemClassificacao', 'ASC')
            .set('campoOrdenacao', 'frota')
            .set('filtroGlobal', pesquisa && pesquisa.trim().length > 0 ? pesquisa.trim() : '');

        return this.http.get(`${this.apiUrl}/cmbFretamento`, {headers: headers, params: params}).toPromise().then(response => {
            return response;
        });
    }

    buscarPorKey(key): any {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        return this.http.get(`${this.apiUrl}/${key}`, {headers})
            .toPromise()
            .then(response => {
                return this.prepararDadosParaReceber(response);
            });
    }

    excluir(key: string): Promise<any> {
        return this.http.delete(`${this.apiUrl}/${key}`)
            .toPromise()
            .then(() => null);
    }

    salvar(obj): Promise<any> {
        let clone = JSON.parse(JSON.stringify(obj));

        delete clone['key'];

        clone = this.prepararDadosParaSalvar(clone);
        return this.http.post(this.apiUrl, clone)
            .toPromise()
            .then(response => {
                return response;
            });
    }

    atualizar(obj): Promise<any> {
        let clone = JSON.parse(JSON.stringify(obj));
        const key = obj.key;

        delete clone['key'];
        clone = this.prepararDadosParaSalvar(clone);

        return this.http.put(`${this.apiUrl}/${key}`, clone)
            .toPromise()
            .then(response => {
                return response;
            });
    }

    prepararDadosParaReceber(response: any): any {
        return response;
    }

    prepararDadosParaSalvar(clone: any): any {
        clone.combustivel = {key: clone.combustivel.key};
        clone.veiculoMarca = {key: clone.veiculoMarca.key};
        clone.veiculoModelo = {key: clone.veiculoModelo.key};
        return clone;
    }

}
