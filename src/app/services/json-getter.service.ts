import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class JsonGetterService {

    constructor(private http: HttpClient) {
    }

    // public getJSON(path: string): Observable<any> {
    //     return this.http.get(path);
    // }

    public readFileAsJson(file: File) {
        return new Promise<any>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                let result = reader.result;
                if (result instanceof ArrayBuffer) {
                    const dec = new TextDecoder();
                    result = dec.decode(result);
                }
                resolve(JSON.parse(result));
            };
            reader.onerror = error => reject(error);
        });
    }
}
