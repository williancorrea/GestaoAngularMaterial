import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {GestaoService} from '../../../seguranca/autenticacao/gestao.service';

@Injectable()
export class FretamentoService {

    apiUrl: string;

    constructor(private http: GestaoService) {
        this.apiUrl = `${environment.apiUrl}/fretamentos`;
    }

    buscarPorKey(key): any {

        const headers = new HttpHeaders();

        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        return this.http.get(`${this.apiUrl}/${key}`, {headers})
            .toPromise()
            .then(response => {
                return response;
            });
    }

    pesquisarClienteCmb(pesquisa: string): Promise<any> {
        const params = new HttpParams()
            .set('size', String(environment.comboBox.linhas))
            .set('page', String(0))
            .set('ordemClassificacao', 'ASC')
            .set('campoOrdenacao', 'nome')
            .set('nome', pesquisa && pesquisa.trim().length > 0 ? pesquisa.trim() : '');

        return this.http.get(`${this.apiUrl}/cmbCliente`, {params: params}).toPromise().then(response => {
            return response;
        });
    }
}
