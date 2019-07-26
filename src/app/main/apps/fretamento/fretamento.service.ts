import {Injectable} from '@angular/core';
import {TransportHttp} from '../../../seguranca/transport-http';
import {environment} from '../../../../environments/environment';

@Injectable()
export class FretamentoService {

    apiUrl: string;

    constructor(private http: TransportHttp) {
        this.apiUrl = `${environment.apiUrl}/fretamentos`;
    }

    // listarTodas(grid: any, controleKmFiltro: any): any {
    //     const config = {
    //         params: {
    //             size: grid.rows,
    //             page: grid.first / grid.rows,
    //             ordemClassificacao: 'DESC',
    //             campoOrdenacao: 'dataHoraSaida'
    //         }
    //     };
    //     if (grid.globalFilter && grid.globalFilter.length > 0) {
    //         config.params['filtroGlobal'] = grid.globalFilter;
    //     }
    //
    //     return this.http.get(`${this.apiUrl}`, config)
    //         .toPromise();
    // }

    buscarPorKey(key): any {
        return this.http.get(`${this.apiUrl}/${key}`)
            .toPromise().then(() => null);
    }

    // excluir(key: string): any {
    //     return this.http.delete(`${this.apiUrl}/${key}`)
    //         .toPromise()
    //         .then(() => null);
    // }

    // salvar(obj): any {
    //     const clone = JSON.parse(JSON.stringify(obj));
    //     return this.http.post(this.apiUrl,
    //         JSON.stringify(clone))
    //         .toPromise();
    // }

    // atualizar(obj): any {
    //     const key = obj.key;
    //
    //     const clone = JSON.parse(JSON.stringify(obj));
    //
    //     return this.http.put(`${this.apiUrl}/${key}`,
    //         JSON.stringify(clone))
    //         .toPromise();
    // }
}
