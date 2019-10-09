import {ElementRef, Injectable} from '@angular/core';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {GestaoService} from '../../seguranca/autenticacao/gestao.service';
import {environment} from '../../../environments/environment';

import * as moment from 'moment';
import {MatPaginator} from '@angular/material';
import {PESSOA_TIPO} from '../modelos/PessoaTipo';


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
            .set('cnh', Boolean(true).toString());

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

    buscarPorCPF(key): any {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        return this.http.get(`${this.apiUrl}/cmbClientes/cpf/${key}`, {headers})
            .toPromise()
            .then(response => {
                return response;
            });
    }

    buscarPorCNPJ(key): any {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        return this.http.get(`${this.apiUrl}/cmbClientes/cnpj/${key}`, {headers})
            .toPromise()
            .then(response => {
                return response;
            });
    }

    pesquisarClienteCmb(pesquisa: string): Promise<any> {

        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('size', String(environment.comboBox.linhas))
            .set('page', String(0))
            .set('ordemClassificacao', 'ASC')
            .set('campoOrdenacao', 'nome')
            .set('nome', pesquisa && pesquisa.trim().length > 0 ? pesquisa.trim() : '');

        return this.http.get(`${this.apiUrl}/cmbClientes`, {headers: headers, params: params}).toPromise().then(response => {
            return response;
        });
    }

    pesquisarMotoristaCmb(pesquisa: string): Promise<any> {

        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('size', String(environment.comboBox.linhas))
            .set('page', String(0))
            .set('ordemClassificacao', 'ASC')
            .set('campoOrdenacao', 'nome')
            .set('nome', pesquisa && pesquisa.trim().length > 0 ? pesquisa.trim() : '');

        return this.http.get(`${this.apiUrl}/cmbMotoristas`, {headers: headers, params: params}).toPromise().then(response => {
            return response;
        });
    }

    pesquisarRepresentanteComercialEmpresaRosinha(): Promise<any> {
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('size', String(environment.comboBox.linhas))
            .set('page', String(0))
            .set('ordemClassificacao', 'ASC')
            .set('campoOrdenacao', 'nome');
        // .set('filtroGlobal', pesquisa && pesquisa.trim().length > 0 ? pesquisa.trim() : '');

        return this.http.get(`${this.apiUrl}/cmbRepresentanteComercialEmpresaRosinha`, {headers: headers, params: params}).toPromise().then(response => {
            return response;
        });
    }

    pesquisarEmpresaRosinha(): Promise<any> {
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('size', String(environment.comboBox.linhas))
            .set('page', String(0))
            .set('ordemClassificacao', 'ASC')
            .set('campoOrdenacao', 'nome');
        // .set('filtroGlobal', pesquisa && pesquisa.trim().length > 0 ? pesquisa.trim() : '');

        return this.http.get(`${this.apiUrl}/cmbEmpresaRosinha`, {headers: headers, params: params}).toPromise().then(response => {
            return response;
        });
    }

    ativarMotorista(key): any {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        return this.http.put(`${this.apiUrl}/${key}/motorista/ativar`, {headers})
            .toPromise()
            .then(response => {
                return this.prepararDadosParaReceber(response);
            });
    }

    desativarMotorista(key): any {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        return this.http.put(`${this.apiUrl}/${key}/motorista/desativar`, {headers})
            .toPromise()
            .then(response => {
                return this.prepararDadosParaReceber(response);
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
                return response;
            });
    }

    salvar(obj: any): Promise<any> {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');


        let clone = JSON.parse(JSON.stringify(obj));
        clone = this.prepararDadosParaSalvar(clone);
        delete clone['key'];

        return this.http.post(this.apiUrl, clone, {headers: headers})
            .toPromise()
            .then(response => {
                return response;
            });
    }

    atualizar(obj: any): Promise<any> {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        const key = obj.key;
        let clone = JSON.parse(JSON.stringify(obj));
        clone = this.prepararDadosParaSalvar(clone);
        delete clone['key'];

        return this.http.put(`${this.apiUrl}/${key}`, clone, {headers: headers})
            .toPromise()
            .then(response => {
                return response;
            });
    }

    private prepararDadosParaSalvar(clone: any): any {

        if (clone['tipo'] === PESSOA_TIPO.FISICA) {
            delete clone['pessoaJuridica'];
        } else {
            delete clone['pessoaFisica'];
        }

        return clone;
    }

    private prepararDadosParaReceber(response: any): any {

        if (response['tipo'] === PESSOA_TIPO.FISICA) {
            delete response['pessoaJuridica'];
        } else {
            delete response['pessoaFisica'];
        }

        return response;
    }
}
