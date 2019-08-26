import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {GestaoService} from '../../../seguranca/autenticacao/gestao.service';
import {FRETAMENTO_EVENTUAL_SITUACAO_ENUM} from '../../../core/modelos/FretamentoEventualSituacao';

@Injectable()
export class FretamentoService {

    apiUrl: string;

    constructor(private http: GestaoService) {
        this.apiUrl = `${environment.apiUrl}/fretamentos`;
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

        return this.http.get(`${this.apiUrl}/cmbCliente`, {headers: headers, params: params}).toPromise().then(response => {
            return response;
        });
    }

    salvar(obj: any): Promise<any> {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');


        const clone = JSON.parse(JSON.stringify(obj));
        delete clone['key'];
        delete clone['controle'];

        if (clone['situacao'] === FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO) {
            delete clone['cliente'];
        }

        return this.http.post(this.apiUrl, clone, {headers : headers})
            .toPromise()
            .then(response => {
                return response;
            });
    }
}
