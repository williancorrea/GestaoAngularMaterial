import {Injectable} from '@angular/core';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {GestaoService} from '../../seguranca/autenticacao/gestao.service';
import {environment} from '../../../environments/environment';

import * as moment from 'moment';


@Injectable()
export class CombustivelService {

    apiUrl: string;

    constructor(private http: GestaoService) {
        this.apiUrl = `${environment.apiUrl}/combustivel`;
        moment.locale('pt-BR');
    }

    cmb(): Promise<any> {
        // TODO: Remover a Autorizacao
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('size', String(300))
            .set('page', String(0))
            .set('ordemClassificacao', 'ASC')
            .set('campoOrdenacao', 'nome');

        return this.http.get(`${this.apiUrl}/cmb`, {headers: headers, params: params}).toPromise().then(response => {
            const lista = [];
            if (response) {
                for (let i = 0; i < response['length']; i++) {
                    lista.push(response[i]['combustivel']);
                }
            }
            return lista;
        });
    }


}
