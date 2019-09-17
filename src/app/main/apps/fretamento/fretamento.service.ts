import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {GestaoService} from '../../../seguranca/autenticacao/gestao.service';
import {FRETAMENTO_EVENTUAL_SITUACAO_ENUM} from '../../../core/modelos/FretamentoEventualSituacao';
import * as moment from 'moment';


@Injectable()
export class FretamentoService {

    apiUrl: string;

    constructor(private http: GestaoService) {
        this.apiUrl = `${environment.apiUrl}/fretamentosEventuais`;
        moment.locale('pt-BR');
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

    pesquisarCidadeCmb(pesquisa: string): Promise<any> {
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        const params = new HttpParams()
            .set('size', String(environment.comboBox.linhas))
            .set('page', String(0))
            .set('ordemClassificacao', 'ASC')
            .set('campoOrdenacao', 'nome')
            .set('filtroGlobal', pesquisa && pesquisa.trim().length > 0 ? pesquisa.trim() : '');

        return this.http.get(`${this.apiUrl}/cmbCidades`, {headers: headers, params: params}).toPromise().then(response => {
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
            delete clone.cliente;
        }

        delete clone.itinerario.partidaData;
        delete clone.itinerario.partidaHora;
        delete clone.itinerario.retornoData;
        delete clone.itinerario.retornoHora;

        clone.itinerario['partida'] = obj.itinerario.partidaData.format('YYYY-MM-DD') + ' ' + obj.itinerario.partidaHora;
        clone.itinerario['retorno'] = obj.itinerario.retornoData.format('YYYY-MM-DD') + ' ' + obj.itinerario.retornoHora;

        clone.itinerario.previsaoChegadaPartida = moment('DD/MM/YYYY HH:mm', obj.itinerario.previsaoChegadaPartida).format('DD/MM/YYYY HH:mm');
        clone.itinerario.previsaoChegadaRetorno = moment('DD/MM/YYYY HH:mm', obj.itinerario.previsaoChegadaRetorno).format('YYYY-MM-DD HH:mm');

        clone.itinerario.partidaCidade = {};
        clone.itinerario.retornoCidade = {};
        clone.itinerario['partidaCidade']['key'] = obj.itinerario.partidaCidade.key;
        clone.itinerario['retornoCidade']['key'] = obj.itinerario.retornoCidade.key;

        // clone.custo.motorista1 = {key: clone.custo.motorista1.key};
        // clone.custo.motorista2 = {key: clone.custo.motorista1.key};




        return this.http.post(this.apiUrl, clone, {headers: headers})
            .toPromise()
            .then(response => {
                return response;
            });
    }
}
