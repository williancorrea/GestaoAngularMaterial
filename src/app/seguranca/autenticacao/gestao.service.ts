import {Injectable} from '@angular/core';
import {HttpClient, HttpHandler} from '@angular/common/http';

export class NotAuthenticatedError {
}

@Injectable()
export class GestaoService extends HttpClient {

    tokensRenokeUrl: string;

    constructor(private httpHandler: HttpHandler) {
        super(httpHandler);
    }

}
