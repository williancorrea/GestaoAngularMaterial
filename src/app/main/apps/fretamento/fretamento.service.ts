import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpHeaders} from '@angular/common/http';
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

}
