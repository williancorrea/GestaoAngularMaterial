import {Injectable} from '@angular/core';

import {TransportHttp} from '../../../seguranca/transport-http';
import {environment} from '../../../../environments/environment';

@Injectable()
export class FretamentoService {

    apiUrl: string;

    constructor(private http: TransportHttp) {
        this.apiUrl = `${environment.apiUrl}/fretamento`;
    }

    /**
     * Lista todos os registro de acordo com os filtros passados por parametros
     */
    listarTodas(grid: any, controleKmFiltro: any): any {
        const config = {
            params: {
                size: grid.rows,
                page: grid.first / grid.rows,
                ordemClassificacao: 'DESC',
                campoOrdenacao: 'dataHoraSaida'
            }
        };
        if (grid.globalFilter && grid.globalFilter.length > 0) {
            config.params['filtroGlobal'] = grid.globalFilter;
        }

        return this.http.get(`${this.apiUrl}`, config)
            .toPromise();
    }

    /**
     * Efetua a pesquisa de acordo com o chave passada por paramentro
     */
    buscarPorKey(key): any {
        return this.http.get(`${this.apiUrl}/${key}`)
            .toPromise();
    }

    /**
     * Exclui o registro de acordo com o chave passada por parametro
     */
    excluir(key: string): any {
        return this.http.delete(`${this.apiUrl}/${key}`)
            .toPromise()
            .then(() => null);
    }

    /**
     * Salva o registro
     */
    salvar(obj): any {
        const clone = JSON.parse(JSON.stringify(obj));
        return this.http.post(this.apiUrl,
            JSON.stringify(clone))
            .toPromise();
    }

    /**
     * Atualiza o registro
     */
    atualizar(obj): any {
        const key = obj.key;

        const clone = JSON.parse(JSON.stringify(obj));

        return this.http.put(`${this.apiUrl}/${key}`,
            JSON.stringify(clone))
            .toPromise();
    }
}
