import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class LogoutService {

    tokensRenokeUrl: string;

    constructor() {
        this.tokensRenokeUrl = `${environment.apiUrl}/tokens/revoke`;
    }

    logout(): any {
        // return this.http.delete(this.tokensRenokeUrl, {withCredentials: true})
        //     .toPromise()
        //     .then(() => {
        //         this.auth.limparAccessToken();
        //     });

        // TODO: Implementar logout
        return null;
    }

}
