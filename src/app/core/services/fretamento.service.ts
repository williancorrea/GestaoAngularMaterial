import {ElementRef, Injectable} from '@angular/core';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {GestaoService} from '../../seguranca/autenticacao/gestao.service';
import * as moment from 'moment';

import {MatPaginator} from '@angular/material';
import {PESSOA_TIPO} from '../modelos/PessoaTipo';
import {FRETAMENTO_EVENTUAL_SITUACAO_ENUM} from '../modelos/FretamentoEventualSituacao';
import {environment} from '../../../environments/environment';

@Injectable()
export class FretamentoService {

    apiUrl: string;

    constructor(private http: GestaoService) {
        this.apiUrl = `${environment.apiUrl}/fretamentosEventuais`;
        moment.locale('pt-BR');
    }

    gerarContrato(key): any {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        return this.http.get(`${this.apiUrl}/${key}/contrato`, {headers, responseType: 'blob'})
            .toPromise()
            .then(response => {
                return response;
                // return new Blob([response], {type: 'application/pdf'});
            });
    }

    gerarTermoResponsabilidadeMotorista(key): any {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        return this.http.get(`${this.apiUrl}/${key}/contratoTermoResponsabilidadeMotorista`, {headers, responseType: 'blob'})
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
        clone = this.prepararDadosParaSalvar(clone, obj);
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
        clone = this.prepararDadosParaSalvar(clone, obj);
        delete clone['key'];

        return this.http.put(`${this.apiUrl}/${key}`, clone, {headers: headers})
            .toPromise()
            .then(response => {
                return response;
            });
    }

    listarTodos(paginador: MatPaginator, filtro: ElementRef): Promise<any> {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');


        const httpParams = new HttpParams()
            .set('size', paginador.pageSize.toString())
            .set('page', paginador.pageIndex.toString())
            .set('filtroGlobal', filtro.nativeElement.value && filtro.nativeElement.value.length > 0 ? filtro.nativeElement.value.trim() : '')
            .set('ordemClassificacao', 'DESC');
        // ordemClassificacao: 'DESC',
        // campoOrdenacao: grid.sortField

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

    cancelarContrato(key): any {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        return this.http.put(`${this.apiUrl}/${key}/cancelarContrato`, {headers})
            .toPromise()
            .then(response => {
                return this.prepararDadosParaReceber(response);
            });
    }

    ativarContrato(key): any {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        return this.http.put(`${this.apiUrl}/${key}/ativarContrato`, {headers})
            .toPromise()
            .then(response => {
                return this.prepararDadosParaReceber(response);
            });
    }

    contratarFretamento(key): any {
        // TODO: REmover a autenticacao FIXA DAQUI
        const headers = new HttpHeaders();
        headers.append('Authorization', 'Basic d2lsbGlhbi52YWdAZ21haWwuY29tOmFkbWlu');
        headers.append('Content-Type', 'application/json');

        return this.http.put(`${this.apiUrl}/${key}/contratarFretamento`, {headers})
            .toPromise()
            .then(response => {
                return this.prepararDadosParaReceber(response);
            });
    }

    private prepararDadosParaSalvar(clone: any, obj: any): any {

        if (clone['situacao'] === FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO_CONTATO || clone['situacao'] === FRETAMENTO_EVENTUAL_SITUACAO_ENUM.NAO_CONTRATADO_CONTATO) {
            delete clone.cliente;
        } else {
            delete clone.contato;
        }

        delete clone.itinerario.partidaData;
        delete clone.itinerario.partidaHora;
        delete clone.itinerario.retornoData;
        delete clone.itinerario.retornoHora;

        clone.itinerario.partida = obj.itinerario.partidaData.format('YYYY-MM-DD').toString() + ' ' + obj.itinerario.partidaHora;
        clone.itinerario.retorno = obj.itinerario.retornoData.format('YYYY-MM-DD').toString() + ' ' + obj.itinerario.retornoHora;
        clone.itinerario.previsaoChegadaPartida = moment(clone.itinerario.previsaoChegadaPartida, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm').toString();
        clone.itinerario.previsaoChegadaRetorno = moment(clone.itinerario.previsaoChegadaRetorno, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm').toString();

        clone.itinerario.partidaCidade = {key: clone.itinerario.partidaCidade.key};
        clone.itinerario.retornoCidade = {key: clone.itinerario.retornoCidade.key};

        clone.itinerario.veiculo = {key: clone.itinerario.veiculo.key};

        clone.custo.notaFiscalImposto = clone.custo.notaFiscalImposto.toFixed(2);
        clone.custo.combustivelLts = clone.custo.combustivelLts.toFixed(2);
        clone.custo.combustivelTotal = clone.custo.combustivelTotal.toFixed(2);
        clone.custo.valorTotalDespesas = clone.custo.valorTotalDespesas.toFixed(2);
        clone.custo.viagemPrecoFinal = clone.custo.viagemPrecoFinal.toFixed(2);
        clone.custo.valorKm = clone.custo.valorKm.toFixed(2);

        clone.custo.motorista1 = {key: clone.custo.motorista1.key};
        if (clone.custo.motorista2 && clone.custo.motorista2.key.length > 0) {
            clone.custo.motorista2 = {key: clone.custo.motorista2.key};
        } else {
            delete clone.custo.motorista2;
        }

        clone.dataImpressaoContrato = moment(clone.dataImpressaoContrato).format('YYYY-MM-DD').toString();
        clone.representanteComercial = {key: clone.representanteComercial.key};
        clone.empresa = {key: clone.empresa.key};
        return clone;
    }

    private prepararDadosParaReceber(response: any): any {
        if (response['situacao'] === FRETAMENTO_EVENTUAL_SITUACAO_ENUM.ORCAMENTO_CONTATO || response['situacao'] === FRETAMENTO_EVENTUAL_SITUACAO_ENUM.NAO_CONTRATADO_CONTATO) {
            delete response['cliente'];
        } else {
            delete response['contato'];
            if (response['cliente']['tipo'] === PESSOA_TIPO.FISICA) {
                delete response['cliente']['pessoaJuridica'];
            } else {
                delete response['cliente']['pessoaFisica'];
            }
        }

        response['itinerario']['partidaData'] = moment(response['itinerario']['partida'], 'YYYY-MM-DD HH:mm');
        response['itinerario']['partidaHora'] = moment(response['itinerario']['partida'], 'YYYY-MM-DD HH:mm').format('HH:mm').toString();
        response['itinerario']['retornoData'] = moment(response['itinerario']['retorno'], 'YYYY-MM-DD HH:mm');
        response['itinerario']['retornoHora'] = moment(response['itinerario']['retorno'], 'YYYY-MM-DD HH:mm').format('HH:mm').toString();

        delete response['itinerario']['partida'];
        delete response['itinerario']['retorno'];

        response['itinerario']['previsaoChegadaPartida'] = moment(response['itinerario']['previsaoChegadaPartida'], 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm').toString();
        response['itinerario']['previsaoChegadaRetorno'] = moment(response['itinerario']['previsaoChegadaRetorno'], 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm').toString();

        response['dataImpressaoContrato'] = moment(response['dataImpressaoContrato'], 'YYYY-MM-DD');
        response['situacaoData'] = moment(response['situacaoData'], 'YYYY-MM-DD');

        return response;
    }
}
