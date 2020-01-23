import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class JsonGetterService {

    constructor(private http: HttpClient) {
    }

    public getJSON(path: string): Observable<any> {
        return this.http.get(path);
    }
}
