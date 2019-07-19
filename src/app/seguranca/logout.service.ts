import {Injectable} from '@angular/core';

import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';
import {TransportHttp} from './transport-http';

@Injectable()
export class LogoutService {

    tokensRenokeUrl: string;

    constructor(private http: TransportHttp,
                private auth: AuthService) {
        this.tokensRenokeUrl = `${environment.apiUrl}/tokens/revoke`;
    }

    logout(): any {
        return this.http.delete(this.tokensRenokeUrl, {withCredentials: true})
            .toPromise()
            .then(() => {
                this.auth.limparAccessToken();
            });
    }

}
